import React, { useEffect, useState } from 'react';
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
  Platform
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import '../global.css';
import { 
  subscribeToNearbyStamps, 
  createStamp, 
  likeStamp, 
  dislikeStamp,
  type Stamp 
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
  const [showStampModal, setShowStampModal] = useState(false);
  const [showAddStampModal, setShowAddStampModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        setStamps(updatedStamps);
      }
    );

    return () => unsubscribe();
  }, [location]);

  const handleStampPress = (stamp: Stamp) => {
    setSelectedStamp(stamp);
    setShowStampModal(true);
  };

  const handleLike = async () => {
    if (!selectedStamp) return;
    
    // Optimistic update
    const optimisticLikes = selectedStamp.likes + 1;
    setSelectedStamp({ ...selectedStamp, likes: optimisticLikes });
    setStamps(stamps.map(s => 
      s.id === selectedStamp.id ? { ...s, likes: optimisticLikes } : s
    ));

    try {
      await likeStamp(selectedStamp.id, selectedStamp.likes);
    } catch (error) {
      // Revert on error
      setSelectedStamp({ ...selectedStamp, likes: selectedStamp.likes });
      setStamps(stamps.map(s => 
        s.id === selectedStamp.id ? { ...s, likes: selectedStamp.likes } : s
      ));
      Alert.alert('Error', 'Failed to like stamp. Please try again.');
    }
  };

  const handleDislike = async () => {
    if (!selectedStamp) return;
    
    // Optimistic update
    const optimisticDislikes = selectedStamp.dislikes + 1;
    setSelectedStamp({ ...selectedStamp, dislikes: optimisticDislikes });
    setStamps(stamps.map(s => 
      s.id === selectedStamp.id ? { ...s, dislikes: optimisticDislikes } : s
    ));

    try {
      await dislikeStamp(selectedStamp.id, selectedStamp.dislikes);
    } catch (error) {
      // Revert on error
      setSelectedStamp({ ...selectedStamp, dislikes: selectedStamp.dislikes });
      setStamps(stamps.map(s => 
        s.id === selectedStamp.id ? { ...s, dislikes: selectedStamp.dislikes } : s
      ));
      Alert.alert('Error', 'Failed to dislike stamp. Please try again.');
    }
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
        <ActivityIndicator size="large" color="#8FD08F" />
        <Text className="text-ac-brown-dark mt-4 text-base">
          Getting your location...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-ac-cream items-center justify-center p-6">
        <ExpoStatusBar style="dark" />
        <View className="bg-white rounded-3xl p-8 shadow-lg items-center">
          <Text className="text-xl font-bold text-ac-brown-dark mb-2">
            Location Error
          </Text>
          <Text className="text-center text-ac-brown text-base">
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!location) {
    return (
      <View className="flex-1 bg-ac-cream items-center justify-center p-6">
        <ExpoStatusBar style="dark" />
        <View className="bg-white rounded-3xl p-8 shadow-lg items-center">
          <Text className="text-xl font-bold text-ac-brown-dark mb-2">
            No Location Available
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-ac-cream">
      <ExpoStatusBar style="dark" />
      
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="terrain"
      >
        {/* Stamp markers */}
        {stamps.map((stamp) => (
          <Marker
            key={stamp.id}
            coordinate={{
              latitude: stamp.coordinates.lat,
              longitude: stamp.coordinates.lng,
            }}
            onPress={() => handleStampPress(stamp)}
          >
            <View style={styles.stampMarker}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={32} 
                color="#FFC107" 
              />
              <View style={styles.stampMarkerBadge}>
                <Text style={styles.stampMarkerText}>{stamp.type.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
      
      {/* Header Card */}
      <View className="absolute top-12 left-4 right-4">
        <View className="bg-white rounded-2xl p-4 shadow-lg">
          <Text className="text-lg font-bold text-ac-brown-dark">
            Trail Map
          </Text>
          <Text className="text-sm text-ac-brown mt-1">
            {stamps.length} stamp{stamps.length !== 1 ? 's' : ''} nearby
          </Text>
        </View>
      </View>

      {/* Floating Add Stamp Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddStampModal(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
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
                      style={styles.statButton}
                      onPress={handleLike}
                    >
                      <MaterialCommunityIcons name="thumb-up" size={20} color="#8FD08F" />
                      <Text style={styles.statText}>{selectedStamp.likes}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.statButton}
                      onPress={handleDislike}
                    >
                      <MaterialCommunityIcons name="thumb-down" size={20} color="#A1887F" />
                      <Text style={styles.statText}>{selectedStamp.dislikes}</Text>
                    </TouchableOpacity>
                  </View>
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
  map: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8FD08F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF8E7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6D4C41',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalBadge: {
    backgroundColor: '#FFE082',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  modalBadgeText: {
    color: '#6D4C41',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  modalDescription: {
    fontSize: 16,
    color: '#6D4C41',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
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
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#6D4C41',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#8FD08F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
