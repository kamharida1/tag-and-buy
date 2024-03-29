import {Platform} from 'react-native';

const isAndroid: boolean = Platform.OS === 'android';

enum AppColors {
  PrimaryBlue = '#2A4BA0',
  PrimaryGreen = '#007900',
  DarkBlue = '#153075',
  DarkGreen = '#005200',
  PrimaryYellow = '#F9B023',
  PureWhite = '#FFF',
  //Grey = '#B2BBCE',
  PureBlack = '#000000',
  LightOrange = '#FF8181',
  GreyLightest = '#8891A5',
  GreyDarkLight = '#3E4554',
  GreyDark = '#1E222B', // Dark Grey important
  LightWhite = '#F8F9FB',
  LightGrey = '#616A7D',
  bgSurfaceSuccess = "rgba(180, 254, 210, 1)",
  TextCritical = "rgba(142, 31, 11, 1)",
  Grey ="#F4F0EF",
  DarkGrey = "#808080",
  FaceBookGrey = "#e1e4e8",
  GreySurface = "rgba(241,241, 241, 1)",
  GreySurfaceSelected = "rgba(235, 235, 235, 1)",
  GreySurfaceInverse = "rgba(181, 181, 181, 1)",
  LightSurfaceInfo= "rgba(202, 230, 255, 1)",
  LightSurfaceSuccess= "rgba(180, 254, 210, 1)",
  LightSurfaceCaution = "rgba(255, 248, 219, 1)",
  LightSurfaceWarning = "rgba(255,228,198,1)",
  LightSurfaceEmphasis = "rgba(232, 243, 255, 1)",
  LightSurfaceCritical = "rgba(255, 205, 210, 1)",
}

enum AppFonts {
  'airRegular' = 'Air-Regular',
  'airMedium' = 'Air-Medium',
  'airExtraBold' = 'Air-SemiBold',
  'airBold' = 'Air-Bold',
  'airLight' = 'Air-Light',
  'airBlack' = 'Air-Black',
  'spaceMono' = 'SpaceMono-Regular',

}

enum FontSizes {
  'small' = 12,
  'regular' = 14,
  'medium' = 16,
  'large' = 18,
  'extraLarge' = 24,
  'infinite' = 30,
  'infiniteLarge' = 35,
}

export {AppColors, AppFonts, FontSizes, isAndroid};