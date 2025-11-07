import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Contact() {
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  // Refs for inputs
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  const handleFormSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the Terms and Conditions');
      return;
    }
    Alert.alert('Success', 'Message sent successfully!');
    setIsFormModalVisible(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
    setAcceptTerms(false);
  };

  const faqData = [
    {
      question: 'Are dinner plates safe for microwave use?',
      answer:
        'Most of our dinner plates are microwave safe, but it is important to check the specific product details. Plates that are labeled as microwave safe can be used without worry. However, avoid using plates with metallic accents in the microwave as they can cause sparks.',
    },
    {
      question: 'How to replace a damaged dinner plate',
      answer:
        'If you have a damaged dinner plate, please contact our customer service team with your order details and photos of the damage. We will help you process a replacement according to our warranty policy.',
    },
    {
      question: 'What is the warranty on dinner plates?',
      answer:
        'Our dinner plates come with a comprehensive warranty that covers manufacturing defects. The warranty period varies by product line, typically ranging from 1-3 years. Please check your specific product documentation for detailed warranty terms.',
    },
    {
      question: 'How to care for your dinner plates',
      answer:
        'To maintain your dinner plates, we recommend hand washing with mild soap and warm water. Avoid harsh abrasives and extreme temperature changes. For dishwasher-safe plates, use the gentle cycle and avoid overcrowding.',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Elan</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Get in touch{'\n'}with Elan</Text>
          <Text style={styles.subtitle}>
            We're here to help with any questions{'\n'}
            or inquiries. Whether you're a consumer{'\n'}
            or a reseller, we've got you covered.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.contactInfo}>
          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Head office</Text>
            <Text style={styles.contactText}>Deventerstraat 11</Text>
            <Text style={styles.contactText}>7575 EM, Oldenzaal</Text>
            <Text style={styles.contactText}>The Netherlands</Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Mail</Text>
            <Text style={styles.contactText}>info@Elan.com</Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactText}>+31 541 581 600</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.formButton}
            onPress={() => setIsFormModalVisible(true)}
          >
            <View style={styles.formButtonContent}>
              <Text style={styles.formButtonTitle}>Questions?</Text>
              <Text style={styles.formButtonText}>Fill in the form</Text>
            </View>
            <View style={styles.formButtonIcon}>
              <AntDesign name="arrowright" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => setIsSupportModalVisible(true)}
          >
            <Text style={styles.supportButtonText}>Support</Text>
            <View style={styles.supportButtonIcon}>
              <AntDesign name="arrowright" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Form Modal */}
      <Modal
        visible={isFormModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFormModalVisible(false)}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>Questions?</Text>
            <Text style={styles.modalTitle}>
              Leave a message{'\n'}and we will{'\n'}contact you soon
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>
                    First name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={firstNameRef}
                    style={styles.textInput}
                    placeholder="First name"
                    placeholderTextColor="#666"
                    value={formData.firstName}
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                    blurOnSubmit={false}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>
                    Last name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={lastNameRef}
                    style={styles.textInput}
                    placeholder="Last name"
                    placeholderTextColor="#666"
                    value={formData.lastName}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>
                    Email Address <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={emailRef}
                    style={styles.textInput}
                    placeholder="example@mail.com"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    blurOnSubmit={false}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>
                    Phone number <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={phoneRef}
                    style={styles.textInput}
                    placeholder="+31 644 666 888"
                    placeholderTextColor="#666"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    returnKeyType="next"
                    onSubmitEditing={() => messageRef.current?.focus()}
                    blurOnSubmit={false}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  />
                </View>
              </View>

              <View style={styles.messageField}>
                <Text style={styles.fieldLabel}>
                  Message <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  ref={messageRef}
                  style={[styles.textInput, styles.messageInput]}
                  placeholder="Type a message..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.message}
                  returnKeyType="done"
                  onSubmitEditing={handleFormSubmit}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                />
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  {acceptTerms && <AntDesign name="check" size={14} color="white" />}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  Accept the <Text style={styles.termsLink}>Terms and Conditions</Text>
                  <Text style={styles.required}> *</Text>
                </Text>
              </View>

              <TouchableOpacity style={styles.sendButton} onPress={handleFormSubmit}>
                <Text style={styles.sendButtonText}>Send message</Text>
                <AntDesign name="arrowright" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Support Modal */}
      <Modal
        visible={isSupportModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.supportModalContainer}>
          <View style={styles.supportModalHeader}>
            <TouchableOpacity
              style={styles.supportCloseButton}
              onPress={() => setIsSupportModalVisible(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.supportModalSubtitle}>Support</Text>
            <Text style={styles.supportModalTitle}>Frequently{'\n'}Asked Questions</Text>

            <View style={styles.faqContainer}>
              {faqData.map((faq, index) => (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    <AntDesign
                      name={expandedFAQ === index ? 'minus' : 'plus'}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {expandedFAQ === index && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f3',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 56,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  contactInfo: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionButtons: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    gap: 20,
  },
  formButton: {
    backgroundColor: '#333',
    padding: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formButtonContent: {
    flex: 1,
  },
  formButtonTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
    fontWeight: '400',
  },
  formButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  formButtonIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  supportButton: {
    backgroundColor: '#e8e8e8',
    padding: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  supportButtonIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 56,
    marginBottom: 40,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
    fontWeight: '500',
  },
  supportModalContainer: {
    flex: 1,
    backgroundColor: '#f8f8f3',
  },
  supportModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  supportCloseButton: {
    padding: 8,
  },
  supportModalTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 56,
    marginBottom: 40,
  },
  supportModalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  formContainer: {
    paddingBottom: 40,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  formField: {
    flex: 1,
  },
  messageField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  required: {
    color: '#ff6b6b',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: 'white',
    minHeight: 50,
  },
  messageInput: {
    height: 100,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 14,
    color: 'white',
    flex: 1,
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
  sendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  // FAQ styles
  faqContainer: {
    gap: 1,
  },
  faqItem: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});