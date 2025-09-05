import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { AntDesign, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCurrentUser, useSignOut } from '../firebase/Hooks/UseAuth';
import { AuthModal } from '../components/Auth';
import { UserService } from '../firebase/service/UserService';
import { useQuery } from '@tanstack/react-query';
import { IUser } from '../firebase/Types/User';

const { width, height } = Dimensions.get('window');

export default function Profile() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Auth hooks
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const signOutMutation = useSignOut();
  
  // User data hook
  const { data: userData, isLoading: userDataLoading } = useQuery<IUser | null>({
    queryKey: ['userData', currentUser?.uid],
    queryFn: () => UserService.getUserData(currentUser?.uid),
    enabled: !!currentUser?.uid,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    street: userData?.address?.street || '',
    city: userData?.address?.city || '',
    state: userData?.address?.state || '',
    zipCode: userData?.address?.zipCode || '',
    country: userData?.address?.country || '',
  });

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  React.useEffect(() => {
    if (userData) {
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        zipCode: userData.address?.zipCode || '',
        country: userData.address?.country || '',
      });
    }
  }, [userData]);

  const handleAuthSuccess = () => {
    setIsAuthModalVisible(false);
    // Refresh user data
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      await UserService.updateUser({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        address: {
          street: editForm.street,
          city: editForm.city,
          state: editForm.state,
          zipCode: editForm.zipCode,
          country: editForm.country,
          isDefault: true,
        }
      });
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutMutation.mutateAsync();
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const profileSections = [
    {
      id: 'orders',
      title: 'Order History',
      icon: 'shopping-bag',
      description: 'View your past orders and track current ones',
      onPress: () => Alert.alert('Coming Soon', 'Order history feature coming soon!'),
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      icon: 'heart',
      description: 'Items you want to purchase later',
      onPress: () => Alert.alert('Coming Soon', 'Wishlist feature coming soon!'),
    },
    {
      id: 'addresses',
      title: 'Shipping Addresses',
      icon: 'location-on',
      description: 'Manage your delivery addresses',
      expandable: true,
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: 'credit-card',
      description: 'Manage your payment options',
      onPress: () => Alert.alert('Coming Soon', 'Payment methods feature coming soon!'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      description: 'Manage your notification preferences',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help',
      description: 'Get help with your account and orders',
      onPress: () => router.push('/contact'),
    },
  ];

  if (userLoading || userDataLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.brandName}>Elan</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.guestContainer}>
          <View style={styles.guestCard}>
            <MaterialIcons name="person-outline" size={80} color="#ccc" />
            <Text style={styles.guestTitle}>Welcome to Elan</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to access your profile, orders, and personalized recommendations
            </Text>
            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={() => setIsAuthModalVisible(true)}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <AuthModal
          visible={isAuthModalVisible}
          onClose={() => setIsAuthModalVisible(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.brandName}>Elan</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Feather name="edit-3" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View style={[styles.profileHeader, { opacity: fadeAnim }]}>
          <View style={styles.avatarContainer}>
            {userData?.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>
                  {(userData?.firstName?.[0] || '') + (userData?.lastName?.[0] || '')}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {userData?.firstName} {userData?.lastName}
          </Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
          <Text style={styles.userPhone}>{userData?.phoneNumber}</Text>
        </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹24,500</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Profile Sections */}
        <View style={styles.sectionsContainer}>
          {profileSections.map((section) => (
            <View key={section.id} style={styles.sectionCard}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={section.expandable ? () => toggleSection(section.id) : section.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.sectionLeft}>
                  <View style={styles.sectionIconContainer}>
                    <MaterialIcons name={section.icon as any} size={24} color="#1a1a1a" />
                  </View>
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionDescription}>{section.description}</Text>
                  </View>
                </View>
                <AntDesign 
                  name={section.expandable && expandedSection === section.id ? "up" : "right"} 
                  size={16} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {section.expandable && expandedSection === section.id && (
                <View style={styles.expandedContent}>
                  {section.id === 'addresses' && (
                    <View style={styles.addressCard}>
                      <Text style={styles.addressTitle}>Default Address</Text>
                      <Text style={styles.addressText}>
                        {userData?.address?.street || 'No street address'}
                      </Text>
                      <Text style={styles.addressText}>
                        {userData?.address?.city || 'No city'}, {userData?.address?.state || 'No state'} {userData?.address?.zipCode || ''}
                      </Text>
                      <Text style={styles.addressText}>
                        {userData?.address?.country || 'No country'}
                      </Text>
                      <TouchableOpacity style={styles.editAddressButton}>
                        <Text style={styles.editAddressText}>Edit Address</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Account Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/About')}>
            <MaterialIcons name="info-outline" size={24} color="#1a1a1a" />
            <Text style={styles.actionText}>About Elan</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/contact')}>
            <MaterialIcons name="contact-support" size={24} color="#1a1a1a" />
            <Text style={styles.actionText}>Contact Support</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.signOutButton]} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={24} color="#dc2626" />
            <Text style={[styles.actionText, styles.signOutText]}>Sign Out</Text>
            <AntDesign name="right" size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.firstName}
                onChangeText={(text) => setEditForm({...editForm, firstName: text})}
                placeholder="Enter first name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.lastName}
                onChangeText={(text) => setEditForm({...editForm, lastName: text})}
                placeholder="Enter last name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm({...editForm, email: text})}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <Text style={styles.sectionHeaderText}>Address</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={editForm.street}
                onChangeText={(text) => setEditForm({...editForm, street: text})}
                placeholder="Enter street address"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.city}
                  onChangeText={(text) => setEditForm({...editForm, city: text})}
                  placeholder="City"
                />
              </View>
              
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.state}
                  onChangeText={(text) => setEditForm({...editForm, state: text})}
                  placeholder="State"
                />
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>ZIP Code</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.zipCode}
                  onChangeText={(text) => setEditForm({...editForm, zipCode: text})}
                  placeholder="ZIP Code"
                />
              </View>
              
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.country}
                  onChangeText={(text) => setEditForm({...editForm, country: text})}
                  placeholder="Country"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  guestCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 40,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 12,
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  editAddressButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editAddressText: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  signOutText: {
    color: '#dc2626',
  },
  bottomPadding: {
    height: 40,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalSave: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
});