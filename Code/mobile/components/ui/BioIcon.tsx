import React from 'react';
import Svg, { Path } from 'react-native-svg';

export function BioIcon({ color = "#434F4D" }: { color?: string }) {
    return (
        <Svg width={17} height={21} viewBox="0 0 17 21" fill="none">
            <Path d="M1 2.9966L2.70104 5.5282C-0.677083 9.2657 4.59375 19.3681 8.58681 19.3681C12.5799 19.3681 18.3618 9.02612 14.5365 5.26466L15.7264 2.14209" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M7.34086 1V2.91667C6.41854 2.92354 5.52381 3.23207 4.79329 3.79514L3.41968 1.79861" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M13.067 1.39931L12.2684 3.54757C11.6306 3.1551 10.9007 2.9375 10.1521 2.91667V1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M1.78271 10.4634C5.33653 9.59293 4.17855 10.1759 6.94973 7.20508" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M5.552 8.72266L6.40652 10.1841" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M11.0386 3.03662L10.5355 3.7953C10.2866 4.14825 10.1584 4.57212 10.1699 5.00382C10.1814 5.43552 10.332 5.85196 10.5993 6.19114" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M15.7824 8.98604H14.0334C13.3477 8.97802 12.6819 9.21602 12.1567 9.65687L11.0706 10.5833" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M12.7557 16.573L11.7574 16.4053C11.4053 16.3493 11.0679 16.2237 10.7648 16.0359C10.4618 15.848 10.1992 15.6016 9.99248 15.3112L9.0022 13.7778" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M3.00439 14.1133L6.74189 14.5765" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    );
}