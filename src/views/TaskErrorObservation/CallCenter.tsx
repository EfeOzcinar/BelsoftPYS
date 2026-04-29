/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import blsCore from '../../core';
import { Contact, CreateContactRequest, Case } from '../../core/Services/CallCenterService/interfaces';

const CALL_HISTORY_KEY = 'callcenter_call_history';
const MAX_HISTORY_PER_CONTACT = 5;

interface CallRecord {
  contactId: number;
  calledAt: string; // ISO string
}

// ─── Avatar colors ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: '#E6F1FB', text: '#185FA5' },
  { bg: '#FBEAF0', text: '#993556' },
  { bg: '#E1F5EE', text: '#0F6E56' },
  { bg: '#FAEEDA', text: '#854F0B' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#FAECE7', text: '#993C1D' },
];

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatCallDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Picker modal ─────────────────────────────────────────────────────────────

interface PickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  allLabel?: string;
  onSelect: (val: string) => void;
  onClose: () => void;
}

function PickerModal({
  visible, title, options, selected, allLabel = 'Tümü',
  onSelect, onClose,
}: PickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.modalOption, selected === '' && styles.modalOptionSelected]}
              onPress={() => { onSelect(''); onClose(); }}>
              <Text style={[styles.modalOptionText, selected === '' && styles.modalOptionTextSelected]}>
                {allLabel}
              </Text>
              {selected === '' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            {options.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.modalOption, selected === opt && styles.modalOptionSelected]}
                onPress={() => { onSelect(opt); onClose(); }}>
                <Text style={[styles.modalOptionText, selected === opt && styles.modalOptionTextSelected]}>
                  {opt}
                </Text>
                {selected === opt && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── New case modal ───────────────────────────────────────────────────────────

interface NewCaseModalProps {
  visible: boolean;
  contact: Contact | null;
  onClose: () => void;
  onSave: (contactId: number, description: string) => Promise<void>;
}

function NewCaseModal({ visible, contact, onClose, onSave }: NewCaseModalProps) {
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!description.trim() || !contact) {
      Alert.alert('Eksik Alan', 'Lütfen açıklama girin.');
      return;
    }
    setSaving(true);
    await onSave(contact.Id, description.trim());
    setSaving(false);
    setDescription('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} style={styles.addSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Yeni Vaka Aç</Text>
            {contact && (
              <Text style={styles.caseContactName}>{contact.Name} — {contact.Municipality}</Text>
            )}
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Sorun açıklaması..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <View style={styles.addModalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setDescription(''); onClose(); }}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveButtonText}>Vakayı Kaydet</Text>}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Add contact modal ────────────────────────────────────────────────────────

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (contact: CreateContactRequest) => Promise<void>;
  municipalities: string[];
}

function AddContactModal({ visible, onClose, onSave, municipalities }: AddContactModalProps) {
  const [name, setName] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [munPickerOpen, setMunPickerOpen] = useState(false);

  function reset() {
    setName(''); setMunicipality(''); setPhone('');
  }

  async function handleSave() {
    if (!name.trim() || !municipality || !phone.trim()) {
      Alert.alert('Eksik Alan', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setSaving(true);
    await onSave({ Name: name.trim(), City: '', County: '', Municipality: municipality, Phone: phone.trim(), Email: '' });
    setSaving(false);
    reset();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} style={styles.addSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Yeni Kişi Ekle</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput style={styles.input} placeholder="Ad Soyad" placeholderTextColor="#999" value={name} onChangeText={setName} />

              <TouchableOpacity style={styles.pickerButton} onPress={() => setMunPickerOpen(true)}>
                <Text style={[styles.pickerButtonText, !municipality && styles.pickerPlaceholder]}>
                  {municipality || 'Belediye seçin'}
                </Text>
                <Text style={styles.pickerChevron}>▾</Text>
              </TouchableOpacity>

              <TextInput style={styles.input} placeholder="Cep Telefonu" placeholderTextColor="#999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

              <View style={styles.addModalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => { reset(); onClose(); }}>
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.saveButtonText}>Kaydet</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <PickerModal
        visible={munPickerOpen}
        title="Belediye Seçin"
        options={municipalities}
        selected={municipality}
        allLabel="Belediye seçin"
        onSelect={setMunicipality}
        onClose={() => setMunPickerOpen(false)}
      />
    </Modal>
  );
}

// ─── Contact card ─────────────────────────────────────────────────────────────

interface ContactCardProps {
  contact: Contact;
  expanded: boolean;
  cases: Case[];
  callHistory: CallRecord[];
  onToggle: () => void;
  onNewCase: (contact: Contact) => void;
  onCall: (contact: Contact) => void;
}

function ContactCard({ contact, expanded, cases, callHistory, onToggle, onNewCase, onCall }: ContactCardProps) {
  const col = getAvatarColor(contact.Id);
  const openCases = cases.filter(c => c.Status !== 'resolved');
  const contactCalls = callHistory
    .filter(r => r.contactId === contact.Id)
    .sort((a, b) => new Date(b.calledAt).getTime() - new Date(a.calledAt).getTime())
    .slice(0, MAX_HISTORY_PER_CONTACT);

  return (
    <TouchableOpacity
      style={[styles.card, expanded && styles.cardExpanded]}
      onPress={onToggle}
      activeOpacity={0.85}>
      <View style={styles.cardRow}>
        <View style={[styles.avatar, { backgroundColor: col.bg }]}>
          <Text style={[styles.avatarText, { color: col.text }]}>{getInitials(contact.Name)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>{contact.Name}</Text>
          <Text style={styles.cardSub} numberOfLines={1}>{contact.Municipality}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onCall(contact)}>
            <Text style={styles.actionIconPhone}>✆</Text>
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={styles.cardDetail}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Telefon</Text>
            <Text style={[styles.detailValue, styles.detailBold]}>{contact.Phone}</Text>
          </View>

          {openCases.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Açık Vaka</Text>
              <View style={styles.caseBadge}>
                <Text style={styles.caseBadgeText}>{openCases.length} vaka</Text>
              </View>
            </View>
          )}

          {/* Call history */}
          <View style={styles.callHistorySection}>
            <Text style={styles.callHistoryTitle}>Arama Geçmişi</Text>
            {contactCalls.length === 0 ? (
              <Text style={styles.callHistoryEmpty}>Henüz arama yapılmadı</Text>
            ) : (
              contactCalls.map((record, i) => (
                <View key={i} style={styles.callHistoryRow}>
                  <Text style={styles.callHistoryIcon}>📞</Text>
                  <Text style={styles.callHistoryDate}>{formatCallDate(record.calledAt)}</Text>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity style={styles.newCaseBtn} onPress={() => onNewCase(contact)}>
            <Text style={styles.newCaseBtnText}>+ Yeni Vaka Aç</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CallCenter() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMun, setSelectedMun] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newCaseContact, setNewCaseContact] = useState<Contact | null>(null);
  const [munPickerOpen, setMunPickerOpen] = useState(false);

  const municipalities = useMemo(() =>
    [...new Set(contacts.map(c => c.Municipality))].filter(Boolean).sort(),
    [contacts]
  );

  useEffect(() => {
    loadContacts();
    loadCallHistory();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      const data = await blsCore.services.callCenterService.getContacts();
      setContacts(data);
    } catch {
      Alert.alert('Hata', 'Kişiler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCallHistory() {
    try {
      const raw = await AsyncStorage.getItem(CALL_HISTORY_KEY);
      if (raw) setCallHistory(JSON.parse(raw));
    } catch {
      // silent
    }
  }

  async function saveCallRecord(contact: Contact) {
    try {
      Linking.openURL('tel:' + contact.Phone.replace(/\s/g, '')).catch(() =>
        Alert.alert('Hata', 'Telefon uygulaması açılamadı.')
      );

      const newRecord: CallRecord = {
        contactId: contact.Id,
        calledAt: new Date().toISOString(),
      };

      const updated = [newRecord, ...callHistory].slice(0, 500);
      setCallHistory(updated);
      await AsyncStorage.setItem(CALL_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // silent
    }
  }

  async function loadCasesForContact(contactId: number) {
    try {
      const data = await blsCore.services.callCenterService.getCasesByContact(contactId);
      setCases(prev => [...prev.filter(c => c.ContactId !== contactId), ...data]);
    } catch {
      // silent
    }
  }

  function handleToggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      loadCasesForContact(id);
    }
  }

  async function handleAddContact(data: CreateContactRequest) {
    try {
      const created = await blsCore.services.callCenterService.createContact(data);
      setContacts(prev => [...prev, created]);
    } catch {
      Alert.alert('Hata', 'Kişi eklenemedi.');
    }
  }

  async function handleCreateCase(contactId: number, description: string) {
    try {
      await blsCore.services.callCenterService.createCase({ ContactId: contactId, Description: description });
      await loadCasesForContact(contactId);
      Alert.alert('Başarılı', 'Vaka açıldı.');
    } catch {
      Alert.alert('Hata', 'Vaka açılamadı.');
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(c => {
      const matchSearch = !q || c.Name.toLowerCase().includes(q) || c.Phone.includes(q);
      const matchMun = !selectedMun || c.Municipality === selectedMun;
      return matchSearch && matchMun;
    });
  }, [contacts, search, selectedMun]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Çağrı Merkezi</Text>
        <TouchableOpacity style={styles.addIconBtn} onPress={() => setAddContactOpen(true)}>
          <Text style={styles.addIconText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="İsim veya telefon ara..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Municipality filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterPicker} onPress={() => setMunPickerOpen(true)}>
          <Text style={[styles.filterPickerText, !selectedMun && styles.filterPlaceholder]} numberOfLines={1}>
            {selectedMun || 'Tüm Belediyeler'}
          </Text>
          <Text style={styles.filterChevron}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Result count */}
      <Text style={styles.resultCount}>{filtered.length} kişi bulundu</Text>

      {/* List */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#4A55A2" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.Id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Kişi bulunamadı</Text>}
          renderItem={({ item }) => (
            <ContactCard
              contact={item}
              expanded={expandedId === item.Id}
              cases={cases.filter(c => c.ContactId === item.Id)}
              callHistory={callHistory}
              onToggle={() => handleToggleExpand(item.Id)}
              onNewCase={contact => setNewCaseContact(contact)}
              onCall={saveCallRecord}
            />
          )}
        />
      )}

      {/* Municipality picker */}
      <PickerModal
        visible={munPickerOpen}
        title="Belediye Seçin"
        options={municipalities}
        selected={selectedMun}
        onSelect={setSelectedMun}
        onClose={() => setMunPickerOpen(false)}
      />

      {/* Add contact modal */}
      <AddContactModal
        visible={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        onSave={handleAddContact}
        municipalities={municipalities}
      />

      {/* New case modal */}
      <NewCaseModal
        visible={newCaseContact !== null}
        contact={newCaseContact}
        onClose={() => setNewCaseContact(null)}
        onSave={handleCreateCase}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F7' },

  header: { backgroundColor: '#4A55A2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  addIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  addIconText: { color: '#fff', fontSize: 22, lineHeight: 26 },

  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 10, borderWidth: 0.5, borderColor: '#E0E0E0', paddingHorizontal: 12 },
  searchIcon: { fontSize: 18, color: '#999', marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 9, fontSize: 14, color: '#1a1a1a' },

  filterRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 10 },
  filterPicker: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 0.5, borderColor: '#E0E0E0', paddingHorizontal: 10, paddingVertical: 8 },
  filterPickerText: { flex: 1, fontSize: 13, color: '#1a1a1a' },
  filterPlaceholder: { color: '#999' },
  filterChevron: { fontSize: 11, color: '#999', marginLeft: 4 },

  resultCount: { marginHorizontal: 16, marginTop: 10, marginBottom: 4, fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '500' },

  list: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 14, marginTop: 40 },

  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#E0E0E0', padding: 12 },
  cardExpanded: { borderColor: '#4A55A2' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { fontSize: 13, fontWeight: '600' },
  cardInfo: { flex: 1, marginRight: 8 },
  cardName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  cardSub: { fontSize: 11, color: '#888', marginTop: 2 },
  cardActions: { flexDirection: 'row' },
  actionBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center' },
  actionIconPhone: { fontSize: 14, color: '#3B6D11' },

  cardDetail: { marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#E0E0E0' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailLabel: { fontSize: 11, color: '#999', width: 64 },
  detailValue: { fontSize: 13, color: '#1a1a1a', flex: 1 },
  detailBold: { fontWeight: '600' },
  caseBadge: { backgroundColor: '#FAECE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  caseBadgeText: { fontSize: 11, color: '#993C1D' },

  callHistorySection: { marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#F0F0F0' },
  callHistoryTitle: { fontSize: 11, color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  callHistoryEmpty: { fontSize: 12, color: '#bbb', fontStyle: 'italic' },
  callHistoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  callHistoryIcon: { fontSize: 12, marginRight: 6 },
  callHistoryDate: { fontSize: 12, color: '#555' },

  newCaseBtn: { backgroundColor: '#4A55A2', borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 10 },
  newCaseBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  addSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
  modalHandle: { width: 36, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  caseContactName: { fontSize: 13, color: '#666', marginBottom: 10 },
  modalOption: { paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center' },
  modalOptionSelected: { backgroundColor: '#F5F6FF' },
  modalOptionText: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  modalOptionTextSelected: { color: '#4A55A2', fontWeight: '600' },
  checkmark: { color: '#4A55A2', fontSize: 16, fontWeight: '700' },

  input: { backgroundColor: '#F5F5F7', borderRadius: 10, borderWidth: 0.5, borderColor: '#E0E0E0', padding: 10, fontSize: 14, color: '#1a1a1a', marginBottom: 8 },
  pickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F7', borderRadius: 10, borderWidth: 0.5, borderColor: '#E0E0E0', padding: 10, marginBottom: 8 },
  pickerButtonText: { flex: 1, fontSize: 14, color: '#1a1a1a' },
  pickerPlaceholder: { color: '#999' },
  pickerChevron: { fontSize: 11, color: '#999' },
  addModalActions: { flexDirection: 'row', gap: 10, marginTop: 12, marginBottom: 8 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 0.5, borderColor: '#E0E0E0', alignItems: 'center' },
  cancelButtonText: { fontSize: 14, color: '#666' },
  saveButton: { flex: 2, padding: 12, borderRadius: 10, backgroundColor: '#4A55A2', alignItems: 'center' },
  saveButtonText: { fontSize: 14, color: '#fff', fontWeight: '600' },
});