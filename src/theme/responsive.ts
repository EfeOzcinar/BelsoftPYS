import { Dimensions, PixelRatio } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

/**
 * Referans tasarım ölçüsü
 * 390x844 → modern iPhone referansı
 */
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

/**
 * Ölçekleme fonksiyonları
 */
const scale = (size: number) => (W / guidelineBaseWidth) * size;
const vScale = (size: number) => (H / guidelineBaseHeight) * size;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const fontScale = PixelRatio.getFontScale();

/**
 * Responsive helpers
 */
export const s = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));

export const vs = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(vScale(size)));

export const fs = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      clamp(size * (1 / fontScale), size * 0.92, size * 1.02)
    )
  );

/**
 * Global spacing tokens
 */
export const SP = {
  page: s(24),
  sectionTop: vs(24),
  cardPad: s(16),
  rLg: s(22),
  rMd: s(20),
  rSm: s(12),
  gapSm: s(8),
  gapMd: s(12),
  gapLg: s(16),
};

/**
 * Screen exports
 */
export const SCREEN_WIDTH = W;
export const SCREEN_HEIGHT = H;

/**
 * Kart genişliği (yatay scroll kartlar için)
 */
export const CARD_W = clamp(
  SCREEN_WIDTH * 0.28,
  s(120),
  s(280)
);

/**
 * Hızlı işlem grid buton genişliği (3 kolon)
 */
const QUICK_COLS = 3;
const QUICK_GAP = s(10);

export const QUICK_BTN_W = Math.floor(
  (SCREEN_WIDTH - SP.page * 2 - QUICK_GAP * (QUICK_COLS - 1)) /
  QUICK_COLS
);