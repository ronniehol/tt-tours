import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface DatePickerProps {
  value: string;          // ISO date string "YYYY-MM-DD" or ""
  onChange: (date: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export function DatePicker({ value, onChange, placeholder = 'Select a date', hasError }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => today.getMonth());

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  // Build the day grid (Monday-first)
  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const goBack = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goForward = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d <= today) return;
    onChange(d.toISOString().split('T')[0]);
    setOpen(false);
  };

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  // Can we go back? Don't show months before current
  const canGoBack = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  return (
    <>
      {/* Field trigger */}
      <TouchableOpacity
        style={[styles.field, hasError && styles.fieldError]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.fieldText, !value && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
        <Text style={styles.calIcon}>📅</Text>
      </TouchableOpacity>

      {/* Calendar modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.card}>

            {/* Month header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={goBack}
                disabled={!canGoBack}
                style={[styles.navBtn, !canGoBack && { opacity: 0.2 }]}
              >
                <Text style={styles.navText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.monthLabel}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <TouchableOpacity onPress={goForward} style={styles.navBtn}>
                <Text style={styles.navText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day-of-week headers */}
            <View style={styles.dowRow}>
              {DAYS.map((d) => (
                <Text key={d} style={styles.dowLabel}>{d}</Text>
              ))}
            </View>

            {/* Day grid */}
            <View style={styles.grid}>
              {cells.map((day, i) => {
                if (!day) return <View key={i} style={styles.cell} />;

                const cellDate = new Date(viewYear, viewMonth, day);
                const isPast = cellDate <= today;
                const isSelected =
                  selectedDate &&
                  selectedDate.getFullYear() === viewYear &&
                  selectedDate.getMonth() === viewMonth &&
                  selectedDate.getDate() === day;

                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.cell, isSelected && styles.cellSelected, isPast && styles.cellPast]}
                    onPress={() => selectDay(day)}
                    activeOpacity={isPast ? 1 : 0.7}
                  >
                    <Text style={[
                      styles.cellText,
                      isSelected && styles.cellTextSelected,
                      isPast && styles.cellTextPast,
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 6,
  },
  fieldError: { borderColor: '#EF4444' },
  fieldText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 15,
    color: Colors.ink,
  },
  placeholder: { color: Colors.muted },
  calIcon: { fontSize: 18 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 340,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.teal,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  navBtn: { padding: 4 },
  navText: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 28,
    color: Colors.white,
    lineHeight: 28,
  },
  monthLabel: {
    fontFamily: 'BarlowCondensed_700Bold_Italic',
    fontSize: 20,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  dowRow: {
    flexDirection: 'row',
    backgroundColor: Colors.teal,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  dowLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    backgroundColor: Colors.cream,
  },
  cell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  cellSelected: { backgroundColor: Colors.orange },
  cellPast: { opacity: 0.3 },
  cellText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    color: Colors.ink,
  },
  cellTextSelected: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: Colors.white,
  },
  cellTextPast: { color: Colors.muted },
});
