const twConfig = {
  button: {
    index: {
      base: [
        'tw-inline-flex tw-items-center tw-justify-center focus:tw-outline-none',
        'disabled:tw-cursor-not-allowed disabled:before:tw-hidden',
        'tw-transition-colors tw-duration-200',
        // 大小
        'tw-px-4 tw-py-2 tw-text-sm',
        // 圆角
        'tw-rounded-md before:tw-rounded-md',
      ],
      variant: {
        primary:
          'tw-bg-blue-600 tw-text-white hover:tw-bg-blue-600 disabled:tw-bg-blue-400 tw-relative before:tw-absolute before:tw-inset-0 before:tw-opacity-0 active:before:tw-opacity-[0.08] before:tw-bg-black before:tw-transition-opacity',
        secondary:
          'tw-bg-blue-100 tw-text-blue-700 hover:tw-bg-blue-100 disabled:tw-bg-blue-50 disabled:tw-text-blue-400 tw-relative before:tw-absolute before:tw-inset-0 before:tw-opacity-0 active:before:tw-opacity-[0.08] before:tw-bg-black before:tw-transition-opacity',
        danger:
          'tw-bg-red-600 tw-text-white hover:tw-bg-red-600 disabled:tw-bg-red-400 tw-relative before:tw-absolute before:tw-inset-0 before:tw-opacity-0 active:before:tw-opacity-[0.08] before:tw-bg-black before:tw-transition-opacity',
        ghost:
          'tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 hover:tw-bg-white disabled:tw-bg-gray-50 disabled:tw-text-gray-400 tw-relative before:tw-absolute before:tw-inset-0 before:tw-opacity-0 active:before:tw-opacity-[0.08] before:tw-bg-black before:tw-transition-opacity',
      },
      block: 'tw-w-full',
    },
    icons: {
      base: '-tw-ml-1 tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin',
      circle1: 'tw-opacity-25',
      circle2: 'tw-opacity-75',
    },
  },
  input: {
    index: {
      base: [
        'tw-w-full tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-3 tw-py-2 tw-text-base tw-text-gray-700',
        'tw-transition-colors tw-duration-200',
        'read-only:tw-bg-gray-50',
        'disabled:tw-cursor-not-allowed disabled:tw-bg-gray-100 disabled:tw-opacity-40',
        'placeholder:tw-text-gray-400',
        'tw-outline-none',
      ],
      noReadOnly:
        'focus:tw-border-blue-600 focus:tw-ring-1 focus:tw-ring-blue-600',
    },
  },
  popup: {
    popup: {
      base: 'tw-fixed tw-z-popup',
    },
    mask: 'tw-z-0',
    body: {
      base: 'tw-fixed tw-z-0 tw-overflow-auto tw-bg-white',
      position: {
        bottom: 'tw-bottom-0 tw-left-0 tw-right-0 tw-max-h-[80vh]',
        top: 'tw-top-0 tw-left-0 tw-right-0 tw-max-h-[80vh]',
        left: 'tw-left-0 tw-top-0 tw-bottom-0 tw-max-w-[80vw]',
        right: 'tw-right-0 tw-top-0 tw-bottom-0 tw-max-w-[80vw]',
        center:
          'tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-w-[70vw] tw-max-h-[80vh]',
        none: '', // 不添加任何位置相关的样式
      },
    },
    transition: {
      bottom: {
        enter: 'tw-transform tw-transition tw-ease-out tw-duration-300',
        enterFrom: 'tw-translate-y-full',
        enterTo: 'tw-translate-y-0',
        leave: 'tw-transform tw-transition tw-ease-in tw-duration-200',
        leaveFrom: 'tw-translate-y-0',
        leaveTo: 'tw-translate-y-full',
      },
      top: {
        enter: 'tw-transform tw-transition tw-ease-out tw-duration-300',
        enterFrom: '-tw-translate-y-full',
        enterTo: 'tw-translate-y-0',
        leave: 'tw-transform tw-transition tw-ease-in tw-duration-200',
        leaveFrom: 'tw-translate-y-0',
        leaveTo: '-tw-translate-y-full',
      },
      left: {
        enter: 'tw-transform tw-transition tw-ease-out tw-duration-300',
        enterFrom: '-tw-translate-x-full',
        enterTo: 'tw-translate-x-0',
        leave: 'tw-transform tw-transition tw-ease-in tw-duration-200',
        leaveFrom: 'tw-translate-x-0',
        leaveTo: '-tw-translate-x-full',
      },
      right: {
        enter: 'tw-transform tw-transition tw-ease-out tw-duration-300',
        enterFrom: 'tw-translate-x-full',
        enterTo: 'tw-translate-x-0',
        leave: 'tw-transform tw-transition tw-ease-in tw-duration-200',
        leaveFrom: 'tw-translate-x-0',
        leaveTo: 'tw-translate-x-full',
      },
      center: {
        enter: 'tw-transform tw-transition tw-ease-out tw-duration-300',
        enterFrom: 'tw-opacity-0 tw-scale-75',
        enterTo: 'tw-opacity-100 tw-scale-100',
        leave: 'tw-transform tw-transition tw-ease-in tw-duration-200',
        leaveFrom: 'tw-opacity-100 tw-scale-100',
        leaveTo: 'tw-opacity-0 tw-scale-75',
      },
      none: {
        enter: 'tw-transition-opacity tw-duration-300',
        enterFrom: 'tw-opacity-0',
        enterTo: 'tw-opacity-100',
        leave: 'tw-transition-opacity tw-duration-200',
        leaveFrom: 'tw-opacity-100',
        leaveTo: 'tw-opacity-0',
      },
    },
  },
  toast: {
    toast: 'tw-z-toast',
    mask: {
      base: 'tw-bg-mask/0',
      maskClickable: 'tw-pointer-events-none',
      noMaskClickable: 'tw-pointer-events-auto',
    },
    body: {
      base: 'tw-bg-transparent tw-left-1/2 -tw-translate-x-1/2 tw-w-[80vw] tw-max-h-[80vh]',
      position: {
        top: 'tw-top-[20%]',
        center: 'tw-top-1/2 -tw-translate-y-1/2',
        bottom: 'tw-bottom-[20%]',
      },
    },
    content: {
      wrap: 'tw-mx-auto tw-w-fit tw-min-w-[120px] tw-rounded-lg tw-bg-mask tw-px-4 tw-py-3',
      text: 'tw-break-words tw-text-center tw-text-sm tw-text-white',
    },
  },
  popover: {
    index: {
      base: 'tw-inline-block',
      popup: {
        base: 'tw-absolute',
        mask: {
          base: 'tw-bg-mask/0',
          maskClickable: 'tw-pointer-events-none',
          noMaskClickable: 'tw-pointer-events-auto',
        },
        body: 'tw-bg-transparent tw-static',
        floating: {
          base: 'tw-z-0',
        },
        floatingWrap: {
          base: 'tw-relative',
          direction: {
            top: 'tw-flex tw-flex-col tw-items-center',
            bottom: 'tw-flex tw-flex-col-reverse tw-items-center',
            left: 'tw-flex tw-flex-row tw-items-center',
            right: 'tw-flex tw-flex-row-reverse tw-items-center',
            'top-start': 'tw-flex tw-flex-col tw-items-start',
            'top-end': 'tw-flex tw-flex-col tw-items-end',
            'bottom-start': 'tw-flex tw-flex-col-reverse tw-items-start',
            'bottom-end': 'tw-flex tw-flex-col-reverse tw-items-end',
            'left-start': 'tw-flex tw-flex-row tw-items-start',
            'left-end': 'tw-flex tw-flex-row tw-items-end',
            'right-start': 'tw-flex tw-flex-row-reverse tw-items-start',
            'right-end': 'tw-flex tw-flex-row-reverse tw-items-end',
          },
        },
        floatingContent: [
          'tw-rounded-lg tw-p-3',
          'tw-shadow-[0_0_30px_0_rgba(0,0,0,.2)]',
          'tw-bg-white tw-text-left',
        ],
        floatingArrow: 'tw-relative tw-z-0',
        floatingArrowDirection: {
          base: 'tw-w-0 tw-h-0 tw-relative',
          direction: {
            // 上方位置的箭头指向下方
            top: 'tw-mx-auto tw-border-l-8 tw-border-t-8 tw-border-r-8 tw-border-transparent tw-mt-[-1px]',
            'top-start':
              'tw-ml-4 tw-border-l-8 tw-border-t-8 tw-border-r-8 tw-border-transparent tw-mt-[-1px]',
            'top-end':
              'tw-mr-4 tw-ml-auto tw-border-l-8 tw-border-t-8 tw-border-r-8 tw-border-transparent tw-mt-[-1px]',

            // 下方位置的箭头指向上方
            bottom:
              'tw-mx-auto tw-border-l-8 tw-border-b-8 tw-border-r-8 tw-border-transparent tw-mb-[-1px]',
            'bottom-start':
              'tw-ml-4 tw-border-l-8 tw-border-b-8 tw-border-r-8 tw-border-transparent tw-mb-[-1px]',
            'bottom-end':
              'tw-mr-4 tw-ml-auto tw-border-l-8 tw-border-b-8 tw-border-r-8 tw-border-transparent tw-mb-[-1px]',

            // 左侧位置的箭头指向右侧
            left: 'tw-my-auto tw-border-t-8 tw-border-l-8 tw-border-b-8 tw-border-transparent tw-ml-[-1px]',
            'left-start':
              'tw-mt-4 tw-border-t-8 tw-border-l-8 tw-border-b-8 tw-border-transparent tw-ml-[-1px]',
            'left-end':
              'tw-mb-4 tw-mt-auto tw-border-t-8 tw-border-l-8 tw-border-b-8 tw-border-transparent tw-ml-[-1px]',

            // 右侧位置的箭头指向左侧
            right:
              'tw-my-auto tw-border-t-8 tw-border-r-8 tw-border-b-8 tw-border-transparent tw-mr-[-1px]',
            'right-start':
              'tw-mt-4 tw-border-t-8 tw-border-r-8 tw-border-b-8 tw-border-transparent tw-mr-[-1px]',
            'right-end':
              'tw-mb-4 tw-mt-auto tw-border-t-8 tw-border-r-8 tw-border-b-8 tw-border-transparent tw-mr-[-1px]',
          },
        },
      },
    },
  },
  checkbox: {
    checkbox: [
      'tw-group tw-relative tw-flex tw-items-center focus:tw-outline-none',
      '[&:not(:last-child)]:tw-mr-1.5',
      'active:tw-opacity-80',
      'data-[disabled]:tw-opacity-40',
    ],
    box: [
      'tw-relative tw-inline-flex tw-h-5 tw-w-5 tw-shrink-0 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded tw-border tw-transition-colors',
      'tw-border-gray-300 tw-bg-white',
      'group-data-[checked]:tw-border-blue-600 group-data-[checked]:tw-bg-blue-600',
      'group-data-[disabled]:tw-cursor-not-allowed',
      'group-data-[hover]:hover:tw-border-blue-500',
    ],
    checked: 'tw-absolute tw-h-3 tw-w-3 tw-text-white',
    label: [
      'tw-ml-2 tw-cursor-pointer tw-select-none',
      'tw-text-gray-700',
      'group-data-[disabled]:tw-cursor-not-allowed',
    ],
    group: 'tw-flex tw-flex-wrap',
    icon: 'tw-h-3 tw-w-3',
  },
  radio: {
    group: 'tw-flex tw-flex-wrap',
    radio: [
      'tw-group tw-relative tw-flex tw-items-center focus:tw-outline-none',
      '[&:not(:last-child)]:tw-mr-1.5',
      'active:tw-opacity-80',
      'data-[disabled]:tw-opacity-40',
    ],
    radioBox: [
      'tw-relative tw-inline-flex tw-h-5 tw-w-5 tw-shrink-0 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-border tw-transition-colors',
      'tw-border-gray-300 tw-bg-white',
      'group-data-[checked]:tw-border-blue-600',
      'group-data-[disabled]:tw-cursor-not-allowed',
      'group-data-[hover]:hover:tw-border-blue-500',
    ],
    radioDot: 'tw-absolute tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-blue-600',
    radioLabel: [
      'tw-ml-2 tw-cursor-pointer tw-select-none',
      'tw-text-gray-700',
      'group-data-[disabled]:tw-cursor-not-allowed',
    ],
  },
  textarea: {
    textareaWrap: 'tw-relative',
    textarea: {
      base: [
        'tw-w-full tw-resize-none tw-rounded-md tw-border tw-border-gray-300 tw-px-3 tw-py-2',
        'tw-text-base tw-text-gray-700 placeholder:tw-text-gray-400',
        'focus:tw-outline-none',
        'disabled:tw-cursor-not-allowed disabled:tw-bg-gray-100 disabled:tw-opacity-40',
        'read-only:tw-bg-gray-50',
      ],
      noReadOnly:
        'focus:tw-border-blue-600 focus:tw-ring-1 focus:tw-ring-blue-600',
    },
    count: 'tw-absolute tw-bottom-1 tw-right-2 tw-text-xs tw-text-gray-400',
  },
  switch: {
    switch: 'tw-flex tw-items-center',
    switchTrack: [
      'tw-group tw-relative tw-inline-flex tw-shrink-0 tw-cursor-pointer tw-rounded-full tw-border tw-transition-colors tw-duration-200 tw-ease-in-out',
      'focus:tw-outline-none',
      'tw-border-gray-200 tw-bg-white tw-px-[1px]',
      'data-[checked]:tw-border-blue-600 data-[checked]:tw-bg-blue-600',
      'data-[disabled]:tw-cursor-not-allowed data-[disabled]:tw-opacity-40',
      // track
      'tw-h-[30px] tw-min-w-[54px]',
    ],
    switchChildrenWrap:
      'tw-flex tw-h-full tw-w-full tw-items-center tw-justify-between',
    switchCheckedText:
      'tw-mx-2 tw-hidden tw-text-xs tw-text-white tw-transition-opacity tw-duration-200 group-data-[checked]:tw-inline',
    switchThumb: [
      'tw-pointer-events-none tw-rounded-full tw-bg-white tw-shadow-lg tw-ring-0 tw-transition-transform tw-duration-200 tw-ease-in-out',
      'tw-flex tw-items-center tw-justify-center',
      'tw-border tw-border-gray-200',
      // thumb 滑块尺寸
      'tw-h-[24px] tw-w-[24px]',
      // translate
      'tw-translate-x-0',
      'group-data-[checked]:tw-translate-x-[calc(100%-24px)]',
    ],
    switchUncheckedText:
      'tw-mx-2 tw-inline tw-text-xs tw-text-gray-700 tw-transition-opacity tw-duration-200 group-data-[checked]:tw-hidden',
    icons: [
      'tw-animate-spin',
      'tw-h-[14px] tw-w-[14px]',
      'tw-text-gray-400 group-data-[checked]:tw-text-blue-600',
    ],
  },
  list: {
    list: {
      base: 'tw-bg-white',
      virtualScroll: 'tw-h-[300px]',
    },
    item: [
      'tw-flex tw-items-center tw-border-b tw-border-gray-100 tw-px-4 tw-py-3 last:tw-border-b-0',
      'data-[clickable]:tw-cursor-pointer data-[clickable]:active:tw-bg-gray-50',
      'data-[disabled]:tw-cursor-not-allowed data-[disabled]:tw-opacity-40',
    ],
    itemPrefix: 'tw-mr-3',
    itemSuffix: 'tw-ml-3',
    itemContent: {
      wrap: 'tw-flex-1',
      title: 'tw-text-base tw-text-gray-900',
      description: 'tw-mt-1 tw-text-sm tw-text-gray-500',
    },
  },
  mask: {
    transition: {
      enter: 'tw-transition-opacity tw-duration-300',
      enterFrom: 'tw-opacity-0',
      enterTo: 'tw-opacity-100',
      leave: 'tw-transition-opacity tw-duration-200',
      leaveFrom: 'tw-opacity-100',
      leaveTo: 'tw-opacity-0',
    },
    content: 'tw-fixed tw-inset-0 tw-z-mask tw-bg-mask',
  },
  loading: {
    mask: 'tw-bg-mask/0',
    position:
      'tw-absolute tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2',
    body: 'tw-flex tw-h-24 tw-w-24 tw-flex-col tw-items-center tw-justify-center tw-rounded-lg tw-bg-mask tw-text-white',
    text: 'tw-mt-2 tw-text-sm',
    loadingIcon: 'tw-h-10 tw-w-10 tw-animate-spin',
  },
};
export { twConfig };
