import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function About() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const values = [
    {
      title: 'Quality & Durability',
      icon: 'category',
      description: 'Our products are suitable for professional use and designed to be enjoyed for a long time. Quality and user-friendliness come first - lightweight, impact- and scratch-resistant.',
      color: '#2D3748'
    },
    {
      title: 'Sustainability',
      icon: 'cyclone',
      description: 'Elan dinnerware is made with love for people and the planet. Our products are produced from carefully selected sources using sustainable materials wherever possible.',
      color: '#22543D'
    },
    {
      title: 'Creativity & Design',
      icon: 'design-services',
      description: 'We let our creativity flow and dare to color outside the lines. We draw inspiration from nature, cities, people, cultures, scents and colors.',
      color: '#553C9A'
    },
    {
      title: 'Uniqueness',
      icon: 'diamond',
      description: 'All Elan collections are of our own design. This offers chefs and hosts a unique opportunity to create a strong, distinctive dining concept.',
      color: '#B83280'
    }
  ];


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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <Text style={styles.mainTitle}>About Elan</Text>
          <Text style={styles.heroSubtitle}>
            Crafting exceptional dinnerware{'\n'}
            for discerning tastes since 2010
          </Text>
        </Animated.View>

        {/* Story Section */}
        <View style={styles.storySection}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.storyText}>
            Elan was born from a passion for creating beautiful, functional dinnerware that enhances every dining experience. 
            We believe that exceptional meals deserve exceptional presentation, and every piece we create reflects our commitment 
            to quality, sustainability, and timeless design.
          </Text>
          <Text style={styles.storyText}>
            From our workshop to your table, each piece undergoes meticulous crafting to ensure it not only looks beautiful 
            but performs flawlessly for years to come. We're not just creating dinnerware; we're crafting the foundation 
            for memorable moments shared around the table.
          </Text>
        </View>

        {/* Values Section */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>What We Stand For</Text>
          {values.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={styles.valueCard}
              onPress={() => toggleSection(index)}
              activeOpacity={0.8}
            >
              <View style={styles.valueHeader}>
                <View style={[styles.iconContainer, { backgroundColor: value.color }]}>
                  <MaterialIcons name={value.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <AntDesign 
                  name={expandedSection === index ? "up" : "down"} 
                  size={16} 
                  color="#666" 
                />
              </View>
              {expandedSection === index && (
                <View style={styles.valueContent}>
                  <Text style={styles.valueDescription}>{value.description}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>




        {/* Mission Section */}
        <View style={styles.missionSection}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.missionCard}>
            <Text style={styles.missionText}>
              "To create dinnerware that transforms ordinary meals into extraordinary experiences, 
              while respecting our planet and supporting communities in our supply chain."
            </Text>
            <Text style={styles.missionAuthor}>- The Elan Team</Text>
          </View>
        </View>

        {/* Contact CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Experience Elan?</Text>
          <Text style={styles.ctaSubtitle}>
            Explore our collections or get in touch with our team
          </Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/Home')}>
              <Text style={styles.primaryButtonText}>Explore Collections</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/contact')}>
              <Text style={styles.secondaryButtonText}>Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  storySection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 16,
  },
  valuesSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  valueCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  valueTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  valueContent: {
    marginTop: 12,
    paddingLeft: 52,
  },
  valueDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  teamSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  teamCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#4a90e2',
    fontWeight: '500',
    marginBottom: 8,
  },
  memberDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  missionSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  missionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1a1a1a',
  },
  missionText: {
    fontSize: 18,
    color: '#1a1a1a',
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  missionAuthor: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'right',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButtons: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});