import {Platform} from 'react-native';

const isAndroid: boolean = Platform.OS === 'android';

enum AppColors {
  PrimaryBlue = '#2A4BA0',
  PrimaryGreen = '#007900',
  DarkBlue = '#153075',
  DarkGreen = '#005200',
  PrimaryYellow = '#F9B023',
  PureWhite = '#FFF',
  Grey = '#B2BBCE',
  PureBlack = '#000000',
  LightOrange = '#FF8181',
  GreyLightest = '#8891A5',
  GreyDarkLight = '#3E4554',
  GreyDark = '#1E222B',
  LightWhite = '#F8F9FB',
  LightGrey = '#616A7D',
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