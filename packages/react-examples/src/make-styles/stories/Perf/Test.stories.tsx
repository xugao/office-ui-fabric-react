import * as React from 'react';
import { createDOMRenderer, makeStyles } from '@fluentui/make-styles';
import { memoizeFunction, mergeStyleSets } from '@fluentui/react';

const resolvedStyles = {
  rootStyles: [
    [
      null,
      null,
      {
        backgroundColor: ['f3rmtva', '.f3rmtva{background-color:transparent;}'],
        color: ['f1vxdh6', '.f1vxdh6{color:#252423;}'],
        fontWeight: ['f5ljve1', '.f5ljve1{font-weight:normal;}'],
        borderRadius: ['fokr779', '.fokr779{border-radius:0;}'],
        height: ['fbhnoac', '.fbhnoac{height:40px;}'],
        ':hoverbackgroundColor': ['f1222thb', '.f1222thb:hover{background-color:#EDEBE9;}'],
        ':hovercolor': ['f12x1zqo', '.f12x1zqo:hover{color:#252423;}'],
        ':activebackgroundColor': ['f1ybrkf6', '.f1ybrkf6:active{background-color:#D2D0CE;}'],
        borderTopWidth: ['f5ogflp', '.f5ogflp{border-top-width:1px;}'],
        borderRightWidth: ['f1hqa2wf', '.f1hqa2wf{border-right-width:1px;}', '.rf1hqa2wf{border-left-width:1px;}'],
        borderBottomWidth: ['f1f09k3d', '.f1f09k3d{border-bottom-width:1px;}'],
        borderLeftWidth: ['finvdd3', '.finvdd3{border-left-width:1px;}', '.rfinvdd3{border-right-width:1px;}'],
        borderTopStyle: ['fzkkow9', '.fzkkow9{border-top-style:solid;}'],
        borderRightStyle: ['fcdblym', '.fcdblym{border-right-style:solid;}', '.rfcdblym{border-left-style:solid;}'],
        borderBottomStyle: ['fg706s2', '.fg706s2{border-bottom-style:solid;}'],
        borderLeftStyle: ['fjik90z', '.fjik90z{border-left-style:solid;}', '.rfjik90z{border-right-style:solid;}'],
        borderTopColor: ['f1p3nwhy', '.f1p3nwhy{border-top-color:transparent;}'],
        borderRightColor: [
          'f11589ue',
          '.f11589ue{border-right-color:transparent;}',
          '.rf11589ue{border-left-color:transparent;}',
        ],
        borderBottomColor: ['f1q5o8ev', '.f1q5o8ev{border-bottom-color:transparent;}'],
        borderLeftColor: [
          'f1pdflbu',
          '.f1pdflbu{border-left-color:transparent;}',
          '.rf1pdflbu{border-right-color:transparent;}',
        ],
        paddingTop: ['f1g0x7ka', '.f1g0x7ka{padding-top:0;}'],
        paddingRight: ['fs0uail', '.fs0uail{padding-right:9px;}', '.rfs0uail{padding-left:9px;}'],
        paddingBottom: ['f1qch9an', '.f1qch9an{padding-bottom:0;}'],
        paddingLeft: ['f1dtg1fn', '.f1dtg1fn{padding-left:9px;}', '.rf1dtg1fn{padding-right:9px;}'],
      },
    ],
  ],
  rootDisabledStyles: [
    [
      null,
      null,
      {
        backgroundColor: ['f3rmtva', '.f3rmtva{background-color:transparent;}'],
        color: ['f1mhogkk', '.f1mhogkk{color:#A19F9D;}'],
        ':hoverbackgroundColor': ['f1cio4g9', '.f1cio4g9:hover{background-color:transparent;}'],
        ':activebackgroundColor': ['f1rot6hk', '.f1rot6hk:active{background-color:transparent;}'],
        borderTopWidth: ['f5ogflp', '.f5ogflp{border-top-width:1px;}'],
        borderRightWidth: ['f1hqa2wf', '.f1hqa2wf{border-right-width:1px;}', '.rf1hqa2wf{border-left-width:1px;}'],
        borderBottomWidth: ['f1f09k3d', '.f1f09k3d{border-bottom-width:1px;}'],
        borderLeftWidth: ['finvdd3', '.finvdd3{border-left-width:1px;}', '.rfinvdd3{border-right-width:1px;}'],
        borderTopStyle: ['fzkkow9', '.fzkkow9{border-top-style:solid;}'],
        borderRightStyle: ['fcdblym', '.fcdblym{border-right-style:solid;}', '.rfcdblym{border-left-style:solid;}'],
        borderBottomStyle: ['fg706s2', '.fg706s2{border-bottom-style:solid;}'],
        borderLeftStyle: ['fjik90z', '.fjik90z{border-left-style:solid;}', '.rfjik90z{border-right-style:solid;}'],
        borderTopColor: ['f1p3nwhy', '.f1p3nwhy{border-top-color:transparent;}'],
        borderRightColor: [
          'f11589ue',
          '.f11589ue{border-right-color:transparent;}',
          '.rf11589ue{border-left-color:transparent;}',
        ],
        borderBottomColor: ['f1q5o8ev', '.f1q5o8ev{border-bottom-color:transparent;}'],
        borderLeftColor: [
          'f1pdflbu',
          '.f1pdflbu{border-left-color:transparent;}',
          '.rf1pdflbu{border-right-color:transparent;}',
        ],
      },
    ],
  ],
  rootCheckedStyles: [
    [
      null,
      null,
      {
        backgroundColor: ['f1vwzk28', '.f1vwzk28{background-color:#E1DFDD;}'],
        color: ['f1vxdh6', '.f1vxdh6{color:#252423;}'],
      },
    ],
  ],
  rootCheckedHoveredStyles: [[null, null, { backgroundColor: ['f1r0nsgw', '.f1r0nsgw{background-color:#EDEBE9;}'] }]],
  rootCheckedDisabledStyles: [
    [
      null,
      null,
      {
        backgroundColor: ['f1vwzk28', '.f1vwzk28{background-color:#E1DFDD;}'],
        ':hoverbackgroundColor': ['f1222thb', '.f1222thb:hover{background-color:#EDEBE9;}'],
        ':hovercolor': ['f12x1zqo', '.f12x1zqo:hover{color:#252423;}'],
        ':hoverborderTopWidth': ['f1dqlhwx', '.f1dqlhwx:hover{border-top-width:1px;}'],
        ':hoverborderRightWidth': [
          'fs8x2yy',
          '.fs8x2yy:hover{border-right-width:1px;}',
          '.rfs8x2yy:hover{border-left-width:1px;}',
        ],
        ':hoverborderBottomWidth': ['f4ni5mc', '.f4ni5mc:hover{border-bottom-width:1px;}'],
        ':hoverborderLeftWidth': [
          'ft71ddo',
          '.ft71ddo:hover{border-left-width:1px;}',
          '.rft71ddo:hover{border-right-width:1px;}',
        ],
        ':hoverborderTopStyle': ['f1sn8sm0', '.f1sn8sm0:hover{border-top-style:solid;}'],
        ':hoverborderRightStyle': [
          'f1wovo5e',
          '.f1wovo5e:hover{border-right-style:solid;}',
          '.rf1wovo5e:hover{border-left-style:solid;}',
        ],
        ':hoverborderBottomStyle': ['fm0h710', '.fm0h710:hover{border-bottom-style:solid;}'],
        ':hoverborderLeftStyle': [
          'f716mnf',
          '.f716mnf:hover{border-left-style:solid;}',
          '.rf716mnf:hover{border-right-style:solid;}',
        ],
        ':hoverborderTopColor': ['f1s2uweq', '.f1s2uweq:hover{border-top-color:transparent;}'],
        ':hoverborderRightColor': [
          'fr80ssc',
          '.fr80ssc:hover{border-right-color:transparent;}',
          '.rfr80ssc:hover{border-left-color:transparent;}',
        ],
        ':hoverborderBottomColor': ['f1ukrpxl', '.f1ukrpxl:hover{border-bottom-color:transparent;}'],
        ':hoverborderLeftColor': [
          'fecsdlb',
          '.fecsdlb:hover{border-left-color:transparent;}',
          '.rfecsdlb:hover{border-right-color:transparent;}',
        ],
        ':activebackgroundColor': ['f16vfsa7', '.f16vfsa7:active{background-color:#EDEBE9;}'],
        ':activecolor': ['ftaz773', '.ftaz773:active{color:#252423;}'],
        ':activeborderTopWidth': ['fj5rxx3', '.fj5rxx3:active{border-top-width:1px;}'],
        ':activeborderRightWidth': [
          'f1bdm4oh',
          '.f1bdm4oh:active{border-right-width:1px;}',
          '.rf1bdm4oh:active{border-left-width:1px;}',
        ],
        ':activeborderBottomWidth': ['fmopp11', '.fmopp11:active{border-bottom-width:1px;}'],
        ':activeborderLeftWidth': [
          'f2lytnf',
          '.f2lytnf:active{border-left-width:1px;}',
          '.rf2lytnf:active{border-right-width:1px;}',
        ],
        ':activeborderTopStyle': ['f6ginmj', '.f6ginmj:active{border-top-style:solid;}'],
        ':activeborderRightStyle': [
          'f1grcyuh',
          '.f1grcyuh:active{border-right-style:solid;}',
          '.rf1grcyuh:active{border-left-style:solid;}',
        ],
        ':activeborderBottomStyle': ['fk1xjsr', '.fk1xjsr:active{border-bottom-style:solid;}'],
        ':activeborderLeftStyle': [
          'fgzu20w',
          '.fgzu20w:active{border-left-style:solid;}',
          '.rfgzu20w:active{border-right-style:solid;}',
        ],
        ':activeborderTopColor': ['ff472gp', '.ff472gp:active{border-top-color:transparent;}'],
        ':activeborderRightColor': [
          'f4yyc7m',
          '.f4yyc7m:active{border-right-color:transparent;}',
          '.rf4yyc7m:active{border-left-color:transparent;}',
        ],
        ':activeborderBottomColor': ['fggejwh', '.fggejwh:active{border-bottom-color:transparent;}'],
        ':activeborderLeftColor': [
          'ft2aflc',
          '.ft2aflc:active{border-left-color:transparent;}',
          '.rft2aflc:active{border-right-color:transparent;}',
        ],
      },
    ],
  ],
  rootExpandedStyles: [
    [
      null,
      null,
      {
        backgroundColor: ['f1vwzk28', '.f1vwzk28{background-color:#E1DFDD;}'],
        ':hoverbackgroundColor': ['f1222thb', '.f1222thb:hover{background-color:#EDEBE9;}'],
      },
    ],
  ],
  labelStyles: [
    [
      null,
      null,
      {
        marginRight: ['frqbfng', '.frqbfng{margin-right:2px;}', '.rfrqbfng{margin-left:2px;}'],
        marginLeft: ['f1oou7ox', '.f1oou7ox{margin-left:10px;}', '.rf1oou7ox{margin-right:10px;}'],
        fontWeight: ['f71fsbu', '.f71fsbu{font-weight:400;}'],
      },
    ],
  ],
  menuIconStyles: [
    [null, null, { marginRight: ['frqbfng', '.frqbfng{margin-right:2px;}', '.rfrqbfng{margin-left:2px;}'] }],
  ],
};

const useRootStyles = makeStyles(resolvedStyles.rootStyles as any);
const useRootDisabledStyles = makeStyles(resolvedStyles.rootDisabledStyles as any);
const useRootCheckedStyles = makeStyles(resolvedStyles.rootCheckedStyles as any);
const useRootCheckedHoveredStyles = makeStyles(resolvedStyles.rootCheckedHoveredStyles as any);
const useRootCheckedDisabledStyles = makeStyles(resolvedStyles.rootCheckedDisabledStyles as any);
const useRootExpandedStyles = makeStyles(resolvedStyles.rootExpandedStyles as any);
const useLabelStyles = makeStyles(resolvedStyles.labelStyles as any);
const useMenuIconStyles = makeStyles(resolvedStyles.menuIconStyles as any);

const makeStylesOptions = { renderer: createDOMRenderer(), tokens: {}, rtl: false };

export const MakeStyles = () => {
  const rootClasses = useRootStyles({}, makeStylesOptions);
  useRootDisabledStyles({}, makeStylesOptions);
  useRootCheckedStyles({}, makeStylesOptions);
  useRootCheckedDisabledStyles({}, makeStylesOptions);
  useRootCheckedHoveredStyles({}, makeStylesOptions);
  useRootExpandedStyles({}, makeStylesOptions);
  useLabelStyles({}, makeStylesOptions);
  useMenuIconStyles({}, makeStylesOptions);

  return <button className={rootClasses}>HTML button</button>;
};

const stylesForMergeStyles = mergeStyleSets({
  root: [
    {
      backgroundColor: 'transparent',
      color: '#252423',
      fontWeight: 'normal',
      borderRadius: 0,
      border: '1px solid transparent',
      height: 40,
      padding: '0 9px',
    },
    {
      selectors: {
        ':hover': { backgroundColor: '#EDEBE9', color: '#252423' },
        ':active': { backgroundColor: '#D2D0CE' },
        '.ms-Fabric--isFocusVisible &:focus': { selectors: { ':active': { backgroundColor: '#D2D0CE' } } },
      },
    },
  ],
  rootDisabled: {
    backgroundColor: 'transparent',
    color: '#A19F9D',
    border: '1px solid transparent',
    selectors: {
      ':hover': { backgroundColor: 'transparent' },
      ':active': { backgroundColor: 'transparent' },
      '.ms-Fabric--isFocusVisible &:focus': [
        [
          [
            { backgroundColor: '#F3F2F1', borderColor: '#000000' },
            { outlineWidth: '2px', outlineStyle: 'dotted', outlineColor: 'transparent' },
            {
              selectors: {
                '@media screen and (-ms-high-contrast: active)': {
                  backgroundColor: 'Highlight',
                  color: 'GrayText',
                  opacity: 1,
                  outlineColor: 'GrayText',
                  MsHighContrastAdjust: 'none',
                  borderTopColor: 'GrayText',
                  borderRightColor: 'GrayText',
                  borderBottomColor: 'GrayText',
                  borderLeftColor: 'GrayText',
                },
              },
            },
          ],
          { backgroundColor: 'transparent' },
        ],
      ],
    },
  },
  rootChecked: {
    backgroundColor: '#E1DFDD',
    color: '#252423',
    selectors: {
      '.ms-Fabric--isFocusVisible &:focus': {
        backgroundColor: '#E1DFDD',
        selectors: { ':hover': { backgroundColor: '#EDEBE9' } },
      },
    },
  },
  rootExpanded: { backgroundColor: '#E1DFDD', selectors: { ':hover': { backgroundColor: '#EDEBE9' } } },
  rootCheckedHovered: { backgroundColor: '#EDEBE9' },
  rootCheckedDisabled: {
    backgroundColor: '#E1DFDD',
    selectors: {
      ':hover': [
        { backgroundColor: '#EDEBE9', color: '#252423', border: '1px solid transparent' },
        {
          selectors: {
            '@media screen and (-ms-high-contrast: active)': {
              backgroundColor: 'Highlight',
              color: 'HighlightText',
              MsHighContrastAdjust: 'none',
              outlineColor: 'ButtonText',
            },
          },
        },
      ],
      ':active': [
        { backgroundColor: '#EDEBE9', color: '#252423', border: '1px solid transparent' },
        {
          selectors: {
            '@media screen and (-ms-high-contrast: active)': {
              backgroundColor: 'Highlight',
              color: 'HighlightText',
              MsHighContrastAdjust: 'none',
              outlineColor: 'ButtonText',
            },
          },
        },
      ],
      '.ms-Fabric--isFocusVisible &:focus': [
        [
          [
            { backgroundColor: '#F3F2F1', borderColor: '#000000' },
            { outlineWidth: '2px', outlineStyle: 'dotted', outlineColor: 'transparent' },
            {
              selectors: {
                '@media screen and (-ms-high-contrast: active)': {
                  backgroundColor: 'Highlight',
                  color: 'GrayText',
                  opacity: 1,
                  outlineColor: 'GrayText',
                  MsHighContrastAdjust: 'none',
                  borderTopColor: 'GrayText',
                  borderRightColor: 'GrayText',
                  borderBottomColor: 'GrayText',
                  borderLeftColor: 'GrayText',
                },
              },
            },
          ],
          { backgroundColor: '#F3F2F1' },
        ],
      ],
    },
  },
  label: { marginRight: 2, marginLeft: 10, fontWeight: 400 },
  menuIcon: { marginRight: 2 },
});

export const MergeStyles = () => {
  return <button className={stylesForMergeStyles.root}>HTML button</button>;
};

export const NoStyles = () => {
  return <button>HTML button</button>;
};
