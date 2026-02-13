import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { PageHeader } from '@/components/ui/PageHeader';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'HRV Basics',
    question: 'What is Heart Rate Variability (HRV)?',
    answer: 'HRV measures the variation in time between each heartbeat. A higher HRV generally indicates better cardiovascular fitness and stress resilience, while a lower HRV can indicate stress, fatigue, or illness.',
  },
  {
    category: 'HRV Basics',
    question: 'What is a good HRV score?',
    answer: 'HRV varies greatly between individuals based on age, fitness level, and genetics. Rather than comparing to others, focus on your personal baseline. The app tracks your trends over time to help you understand what is normal for you.',
  },
  {
    category: 'HRV Basics',
    question: 'When should I measure my HRV?',
    answer: 'For the most consistent results, measure your HRV first thing in the morning before getting out of bed. This gives a resting baseline that is less affected by daily activities, caffeine, or stress.',
  },
  {
    category: 'Using the App',
    question: 'How do I connect my sensor?',
    answer: 'Go to the Sensors tab, ensure Bluetooth is enabled, and tap "Scan" to search for nearby BLE devices. The app supports standard BLE heart rate monitors including Polar chest straps and compatible finger pulse sensors.',
  },
  {
    category: 'Using the App',
    question: 'What does the Biological Age score mean?',
    answer: 'Your Biological Age is an estimate based on your HRV data, activity levels, and recovery patterns. It reflects how well your body is functioning compared to your chronological age. A lower biological age indicates better overall health.',
  },
  {
    category: 'Using the App',
    question: 'How are my Quick Actions calculated?',
    answer: 'Quick Actions like Activity, Sleep, and Meditation are personalized suggestions based on your HRV trends, recovery status, and activity history. They help you make decisions that support your well-being.',
  },
  {
    category: 'Health & Recovery',
    question: 'How does sleep affect my HRV?',
    answer: 'Quality sleep is one of the strongest positive influences on HRV. Nights with 7 or more hours of deep sleep typically result in higher HRV the following morning. The app tracks this correlation for you.',
  },
  {
    category: 'Health & Recovery',
    question: 'Why is my HRV low today?',
    answer: 'Low HRV can be caused by poor sleep, high stress, intense exercise the previous day, alcohol consumption, illness, or dehydration. Check your recent activity log and sleep data for patterns.',
  },
  {
    category: 'Health & Recovery',
    question: 'What is the Burnout Resilience score?',
    answer: 'Burnout Resilience reflects your body\u2019s ability to handle sustained stress based on HRV patterns over weeks. A higher score means your autonomic nervous system is recovering well between stressors.',
  },
  {
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Go to your Profile from the top-right icon on the home screen, then tap Settings. You can update your email and password from there.',
  },
  {
    category: 'Account',
    question: 'Is my health data secure?',
    answer: 'Yes. All your health data is encrypted in transit and at rest. We never share your personal health information with third parties. You can request data deletion at any time from Settings.',
  },
];

// ─── SUPPORT EMAIL ───
const SUPPORT_EMAIL = 'hrv4hrv4@gmail.com';

function openSupportEmail() {
  const subject = encodeURIComponent('HRV4 Support Request');
  const body = encodeURIComponent(
    `Hello HRV4 Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\n---\nApp: HRV-4\nPlatform: ${Platform.OS}\n`
  );
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

  Linking.canOpenURL(mailtoUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(mailtoUrl);
      } else {
        // Fallback: try opening mailto directly
        return Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
      }
    })
    .catch((error) => {
      console.error('Error opening email:', error);
      Alert.alert(
        'Email Not Available',
        `Please send your support request to ${SUPPORT_EMAIL}`,
        [{ text: 'OK' }]
      );
    });
}

// Group FAQs by category
function groupByCategory(items: FAQItem[]) {
  const map: Record<string, FAQItem[]> = {};
  items.forEach(item => {
    if (!map[item.category]) map[item.category] = [];
    map[item.category].push(item);
  });
  return Object.entries(map);
}

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={styles.accordionItem}
      onPress={() => setOpen(!open)}
      activeOpacity={0.7}
    >
      <View style={styles.questionRow}>
        <ThemedText style={styles.questionText}>{item.question}</ThemedText>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="rgba(67,79,77,0.4)"
        />
      </View>
      {open && (
        <ThemedText style={styles.answerText}>{item.answer}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

export default function FAQScreen() {
  const grouped = groupByCategory(FAQ_DATA);

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PageHeader title="FAQ" variant="default" />
        {/* Intro */}
        <View style={styles.introCard}>
          <Ionicons name="help-circle-outline" size={28} color="#5CB89A" />
          <ThemedText style={styles.introTitle}>
            How can we help?
          </ThemedText>
          <ThemedText style={styles.introSubtitle}>
            Find answers to common questions about HRV tracking, using the app, and improving your health.
          </ThemedText>
        </View>

        {/* FAQ Sections */}
        {grouped.map(([category, items]) => (
          <View key={category} style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>{category}</ThemedText>
            {items.map((item, index) => (
              <AccordionItem key={index} item={item} />
            ))}
          </View>
        ))}

        {/* Contact */}
        <View style={styles.contactCard}>
          <ThemedText style={styles.contactTitle}>Still have questions?</ThemedText>
          <ThemedText style={styles.contactText}>
            Reach out to our support team and we{'\u2019'}ll get back to you as soon as possible.
          </ThemedText>
          <TouchableOpacity style={styles.contactButton} onPress={openSupportEmail}>
            <Ionicons name="mail-outline" size={18} color="#FFF" />
            <ThemedText style={styles.contactButtonText}>Contact Support</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.emailHint}>{SUPPORT_EMAIL}</ThemedText>
        </View>
      </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },

  // Intro
  introCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#434F4D',
    marginTop: 10,
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(67,79,77,0.65)',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Section
  sectionCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#434F4D',
    marginBottom: 12,
  },

  // Accordion
  accordionItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#434F4D',
    flex: 1,
  },
  answerText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(67,79,77,0.7)',
    lineHeight: 20,
    marginTop: 10,
  },

  // Contact
  contactCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    padding: 22,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#3D4E4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#434F4D',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(67,79,77,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5CB89A',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#5CB89A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  emailHint: {
    fontSize: 12,
    color: 'rgba(67,79,77,0.4)',
    marginTop: 10,
  },
});