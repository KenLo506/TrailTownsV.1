import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Header from '../components/Header';
import TrailIcon from '../components/TrailIcon';
import { animalCrossingMapStyle } from '../src/utils/mapStyles';
import '../global.css';
import { 
  subscribeToNearbyStamps, 
  createStamp, 
  toggleLikeStamp,
  toggleDislikeStamp,
  getUserVote,
  deleteStamp,
  type Stamp,
  type UserVote
} from '../src/services/stamps';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [userVote, setUserVote] = useState<UserVote>(null);
  const [showStampModal, setShowStampModal] = useState(false);
  const [showAddStampModal, setShowAddStampModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const markerAnimations = useRef<{ [key: string]: Animated.Value }>({});
  
  // Add stamp form state
  const [newStampType, setNewStampType] = useState('');
  const [newStampTitle, setNewStampTitle] = useState('');
  const [newStampDescription, setNewStampDescription] = useState('');

  useEffect(() => {
    // Request location permissions and get current location
    const getLocation = async () => {
      try {
        setLoading(true);
        
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Location permission denied. Please enable location access in settings.');
          setLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        setLocation(coords);
        
        // Set map region to user location
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error getting location:', err);
        setError('Failed to get your location. Please try again.');
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // Subscribe to nearby stamps when location is available
  useEffect(() => {
    if (!location) return;

    const radiusKm = 10; // 10km radius
    const unsubscribe = subscribeToNearbyStamps(
      location.latitude,
      location.longitude,
      radiusKm,
      (updatedStamps) => {
        // Animate new stamps
        updatedStamps.forEach((stamp) => {
          if (!markerAnimations.current[stamp.id]) {
            markerAnimations.current[stamp.id] = new Animated.Value(0);
            // Bounce animation
            Animated.spring(markerAnimations.current[stamp.id], {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }
        });
        setStamps(updatedStamps);
      }
    );

    return () => unsubscribe();
  }, [location]);

  const handleStampPress = async (stamp: Stamp) => {
    setSelectedStamp(stamp);
    setShowStampModal(true);
    // Get user's vote for this stamp
    const vote = await getUserVote(stamp.id);
    setUserVote(vote);
  };

  const handleLike = async () => {
    if (!selectedStamp) return;
    
    const wasLiked = userVote === 'like';
    const wasDisliked = userVote === 'dislike';
    
    // Optimistic update
    let optimisticLikes = selectedStamp.likes;
    let optimisticDislikes = selectedStamp.dislikes;
    let optimisticVote: UserVote = userVote;
    
    if (wasLiked) {
      // Undo like
      optimisticLikes = Math.max(0, optimisticLikes - 1);
      optimisticVote = null;
    } else {
      // Add like
      optimisticLikes = optimisticLikes + 1;
      optimisticVote = 'like';
      // Remove dislike if it existed
      if (wasDisliked) {
        optimisticDislikes = Math.max(0, optimisticDislikes - 1);
      }
    }
    
    const updatedStamp = { ...selectedStamp, likes: optimisticLikes, dislikes: optimisticDislikes };
    setSelectedStamp(updatedStamp);
    setUserVote(optimisticVote);
    setStamps(stamps.map(s => 
      s.id === selectedStamp.id ? updatedStamp : s
    ));

    try {
      const result = await toggleLikeStamp(selectedStamp.id);
      // Update with actual result
      const finalStamp = { ...selectedStamp, likes: result.newLikes, dislikes: result.newDislikes };
      setSelectedStamp(finalStamp);
      setUserVote(result.userVote);
      setStamps(stamps.map(s => 
        s.id === selectedStamp.id ? finalStamp : s
      ));
    } catch (error) {
      // Revert on error
      setSelectedStamp(selectedStamp);
      setUserVote(userVote);
      setStamps(stamps.map(s => 
        s.id === selectedStamp.id ? selectedStamp : s
      ));
      Alert.alert('Error', 'Failed to like stamp. Please try again.');
    }
  };

  const handleDislike = async () => {
    if (!selectedStamp) return;
    
    const wasLiked = userVote === 'like';
    const wasDisliked = userVote === 'dislike';
    
    // Optimistic update
    let optimisticLikes = selectedStamp.likes;
    let optimisticDislikes = selectedStamp.dislikes;
    let optimisticVote: UserVote = userVote;
    
    if (wasDisliked) {
      // Undo dislike
      optimisticDislikes = Math.max(0, optimisticDislikes - 1);
      optimisticVote = null;
    } else {
      // Add dislike
      optimisticDislikes = optimisticDislikes + 1;
      optimisticVote = 'dislike';
      // Remove like if it existed
      if (wasLiked) {
        optimisticLikes = Math.max(0, optimisticLikes - 1);
      }
    }
    
    const updatedStamp = { ...selectedStamp, likes: optimisticLikes, dislikes: optimisticDislikes };
    setSelectedStamp(updatedStamp);
    setUserVote(optimisticVote);
    setStamps(stamps.map(s => 
      s.id === selectedStamp.id ? updatedStamp : s
    ));

    try {
      const result = await toggleDislikeStamp(selectedStamp.id);
      // Update with actual result
      const finalStamp = { ...selectedStamp, likes: result.newLikes, dislikes: result.newDislikes };
      setSelectedStamp(finalStamp);
      setUserVote(result.userVote);
      setStamps(stamps.map(s => 
        s.id === selectedStamp.id ? finalStamp : s
      ));
    } catch (error) {
      // Revert on error
      setSelectedStamp(selectedStamp);
      setUserVote(userVote);
      setStamps(stamps.map(s => 
        s.id === selectedStamp.id ? selectedStamp : s
      ));
      Alert.alert('Error', 'Failed to dislike stamp. Please try again.');
    }
  };

  const handleDeleteStamp = async () => {
    if (!selectedStamp) return;
    
    Alert.alert(
      'Delete Stamp',
      'Are you sure you want to delete this stamp? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStamp(selectedStamp.id);
              setStamps(stamps.filter(s => s.id !== selectedStamp.id));
              setShowStampModal(false);
              setSelectedStamp(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete stamp. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddStamp = async () => {
    if (!location || !newStampType.trim() || !newStampTitle.trim()) {
      Alert.alert('Error', 'Please fill in type and title');
      return;
    }

    setIsSubmitting(true);
    
    // Optimistic update - add stamp to local state immediately
    const optimisticStamp: Stamp = {
      id: `temp-${Date.now()}`,
      type: newStampType,
      title: newStampTitle,
      description: newStampDescription,
      coordinates: {
        lat: location.latitude,
        lng: location.longitude,
      },
      likes: 0,
      dislikes: 0,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
    };
    
    setStamps([...stamps, optimisticStamp]);
    setShowAddStampModal(false);
    
    // Reset form
    setNewStampType('');
    setNewStampTitle('');
    setNewStampDescription('');

    try {
      await createStamp({
        type: newStampType,
        title: newStampTitle,
        description: newStampDescription,
        coordinates: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
      
      // The snapshot listener will update with the real data
      setIsSubmitting(false);
    } catch (error) {
      // Remove optimistic stamp on error
      setStamps(stamps.filter(s => s.id !== optimisticStamp.id));
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to create stamp. Please try again.');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-ac-cream items-center justify-center">
        <ExpoStatusBar style="dark" />
        <Header useLogoImage={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8FD08F" />
          <Text style={styles.loadingText}>
            Getting your location... 🌲
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-ac-cream">
        <ExpoStatusBar style="dark" />
        <Header useLogoImage={true} />
        <View className="flex-1 items-center justify-center p-6">
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#A1887F" />
            <Text style={styles.errorTitle}>
              Location Error
            </Text>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (!location) {
    return (
      <View className="flex-1 bg-ac-cream">
        <ExpoStatusBar style="dark" />
        <Header useLogoImage={true} />
        <View className="flex-1 items-center justify-center p-6">
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="map-marker-off" size={48} color="#A1887F" />
            <Text style={styles.errorTitle}>
              No Location Available
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-ac-cream">
      <ExpoStatusBar style="dark" />
      <Header title="Trail Map" />
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType="standard"
          customMapStyle={animalCrossingMapStyle}
          pitchEnabled={false}
          rotateEnabled={false}
          showsCompass={false}
          showsScale={false}
          toolbarEnabled={false}
        >
        {/* Stamp markers */}
        {stamps.map((stamp) => {
          const scale = markerAnimations.current[stamp.id] || new Animated.Value(1);
          return (
            <Marker
              key={stamp.id}
              coordinate={{
                latitude: stamp.coordinates.lat,
                longitude: stamp.coordinates.lng,
              }}
              onPress={() => handleStampPress(stamp)}
            >
              <Animated.View
                style={[
                  styles.stampMarker,
                  {
                    transform: [{ scale }],
                  },
                ]}
              >
                <TrailIcon 
                  name="signpost" 
                  size={36} 
                  color="#FFC107" 
                />
                <View style={styles.stampMarkerBadge}>
                  <Text style={styles.stampMarkerText}>{stamp.type.charAt(0).toUpperCase()}</Text>
                </View>
                {/* Like/Dislike counts on marker */}
                <View style={styles.stampMarkerCounts}>
                  <View style={styles.countBadge}>
                    <MaterialCommunityIcons name="thumb-up" size={10} color="#8FD08F" />
                    <Text style={styles.countText}>{stamp.likes}</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <MaterialCommunityIcons name="thumb-down" size={10} color="#A1887F" />
                    <Text style={styles.countText}>{stamp.dislikes}</Text>
                  </View>
                </View>
              </Animated.View>
            </Marker>
          );
        })}
        </MapView>
      </View>
      
      {/* Info Card */}
      <View className="absolute top-24 left-4 right-4">
        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            <TrailIcon name="map" size={28} color="#8FD08F" />
          </View>
          <View className="ml-4 flex-1">
            <Text style={styles.infoTitle}>
              {stamps.length} stamp{stamps.length !== 1 ? 's' : ''} nearby
            </Text>
            <Text style={styles.infoSubtitle}>
              Tap markers to explore 🌲
            </Text>
          </View>
        </View>
      </View>

      {/* Floating Add Stamp Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddStampModal(true)}
        activeOpacity={0.8}
      >
        <TrailIcon name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Stamp Detail Modal */}
      <Modal
        visible={showStampModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStampModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedStamp && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedStamp.title}</Text>
                  <TouchableOpacity
                    onPress={() => setShowStampModal(false)}
                    style={styles.closeButton}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#A1887F" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalBadge}>
                    <Text style={styles.modalBadgeText}>{selectedStamp.type}</Text>
                  </View>
                  
                  <Text style={styles.modalDescription}>{selectedStamp.description}</Text>
                  
                  <View style={styles.modalStats}>
                    <TouchableOpacity 
                      style={[
                        styles.statButton,
                        userVote === 'like' && styles.statButtonActive
                      ]}
                      onPress={handleLike}
                    >
                      <MaterialCommunityIcons 
                        name="thumb-up" 
                        size={20} 
                        color={userVote === 'like' ? '#6BA66B' : '#8FD08F'} 
                      />
                      <Text style={[
                        styles.statText,
                        userVote === 'like' && styles.statTextActive
                      ]}>
                        {selectedStamp.likes}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.statButton,
                        userVote === 'dislike' && styles.statButtonActive
                      ]}
                      onPress={handleDislike}
                    >
                      <MaterialCommunityIcons 
                        name="thumb-down" 
                        size={20} 
                        color={userVote === 'dislike' ? '#6D4C41' : '#A1887F'} 
                      />
                      <Text style={[
                        styles.statText,
                        userVote === 'dislike' && styles.statTextActive
                      ]}>
                        {selectedStamp.dislikes}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Delete button */}
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={handleDeleteStamp}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color="#D32F2F" />
                    <Text style={styles.deleteButtonText}>Delete Stamp</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Stamp Modal */}
      <Modal
        visible={showAddStampModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddStampModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Stamp</Text>
              <TouchableOpacity
                onPress={() => setShowAddStampModal(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#A1887F" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Scenic View, Trail Marker"
                value={newStampType}
                onChangeText={setNewStampType}
                placeholderTextColor="#A1887F"
              />
              
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter stamp title"
                value={newStampTitle}
                onChangeText={setNewStampTitle}
                placeholderTextColor="#A1887F"
              />
              
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add a description (optional)"
                value={newStampDescription}
                onChangeText={setNewStampDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#A1887F"
              />
              
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleAddStamp}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Stamp</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#E8F5E9', // Soft green background for map edges
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8FD08F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8FD08F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#6BA66B',
  },
  stampMarker: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampMarkerBadge: {
    position: 'absolute',
    top: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  stampMarkerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6BA66B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#A1887F',
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: '#FFF8E1',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '80%',
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6D4C41',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalBadge: {
    backgroundColor: '#FFE082',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFC107',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBadgeText: {
    color: '#6D4C41',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  modalDescription: {
    fontSize: 17,
    color: '#6D4C41',
    lineHeight: 26,
    marginBottom: 20,
    fontWeight: '400',
  },
  modalStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 10,
    minWidth: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D4C41',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6D4C41',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    color: '#6D4C41',
    borderWidth: 2,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#8FD08F',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#8FD08F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#6BA66B',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stampMarkerCounts: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 2,
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6D4C41',
  },
  statButtonActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#8FD08F',
  },
  statTextActive: {
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 16,
    borderRadius: 24,
    marginTop: 20,
    gap: 10,
    borderWidth: 2,
    borderColor: '#FFCDD2',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6D4C41',
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    maxWidth: 320,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#A1887F',
    textAlign: 'center',
    lineHeight: 24,
  },
});
