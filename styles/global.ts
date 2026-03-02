export const colors = {
  deepCharcoal: '#1A1A1A',
  white: '#FFFFFF',
  electricBlue: '#007AFF', // Example accent color
  limeGreen: '#32CD32', // Example accent color
  glassBorder: '#333333',
};

export const typography = {
  primary: 'Inter', // Assuming Inter is available, or a fallback sans-serif
  heavy: '700',
  light: '300',
};

export const layout = {
  borderRadius: 16,
  pillBorderRadius: 30,
  padding: 16,
  margin: 16,
};

export const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
    paddingHorizontal: layout.padding,
    paddingTop: layout.padding * 2,
    paddingBottom: layout.padding,
  },
  card: {
    backgroundColor: 'rgba(40, 40, 40, 0.6)', // Glassmorphism effect
    borderRadius: layout.borderRadius,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: layout.padding,
    marginBottom: layout.margin,
  },
  headerText: {
    fontFamily: typography.primary,
    fontWeight: typography.heavy,
    fontSize: 28,
    color: colors.white,
  },
  bodyText: {
    fontFamily: typography.primary,
    color: colors.white,
  },
  secondaryText: {
    fontFamily: typography.primary,
    fontWeight: typography.light,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  button: {
    backgroundColor: colors.electricBlue,
    borderRadius: layout.pillBorderRadius,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.primary,
    fontWeight: '600',
    color: colors.white,
    fontSize: 16,
  },
};
