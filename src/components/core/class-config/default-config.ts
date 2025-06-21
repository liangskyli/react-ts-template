const defaultConfig = {
  button: {
    index: {
      base: [
        'inline-flex items-center justify-center focus:outline-none',
        'disabled:cursor-not-allowed disabled:before:hidden',
        'transition-colors duration-200',
        // 大小
        'px-4 py-2 text-sm',
        // 圆角
        'rounded-md before:rounded-md',
      ],
      variant: {
        primary:
          'bg-blue-600 text-white hover:bg-blue-600 disabled:bg-blue-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        secondary:
          'bg-blue-100 text-blue-700 hover:bg-blue-100 disabled:bg-blue-50 disabled:text-blue-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        danger:
          'bg-red-600 text-white hover:bg-red-600 disabled:bg-red-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        ghost:
          'bg-white text-gray-700 border border-gray-300 hover:bg-white disabled:bg-gray-50 disabled:text-gray-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
      },
      block: 'w-full',
    },
    icons: {
      base: '-ml-1 mr-2 h-4 w-4 animate-spin',
      circle1: 'opacity-25',
      circle2: 'opacity-75',
    },
  },
  input: {
    index: {
      base: [
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-700',
        'transition-colors duration-200',
        'read-only:bg-gray-50',
        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40',
        'placeholder:text-gray-400',
        'outline-none',
      ],
      noReadOnly: 'focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
    },
  },
  popup: {
    popup: {
      base: 'fixed z-[1000]',
    },
    mask: 'z-0',
    body: {
      base: 'fixed z-0 overflow-auto bg-white',
      position: {
        bottom: 'bottom-0 left-0 right-0 max-h-[80vh]',
        top: 'top-0 left-0 right-0 max-h-[80vh]',
        left: 'left-0 top-0 bottom-0 max-w-[80vw]',
        right: 'right-0 top-0 bottom-0 max-w-[80vw]',
        center:
          'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-h-[80vh]',
        none: '', // 不添加任何位置相关的样式
      },
    },
    transition: {
      bottom: {
        enter: 'transform transition ease-out duration-300',
        enterFrom: 'translate-y-full',
        enterTo: 'translate-y-0',
        leave: 'transform transition ease-in duration-200',
        leaveFrom: 'translate-y-0',
        leaveTo: 'translate-y-full',
      },
      top: {
        enter: 'transform transition ease-out duration-300',
        enterFrom: '-translate-y-full',
        enterTo: 'translate-y-0',
        leave: 'transform transition ease-in duration-200',
        leaveFrom: 'translate-y-0',
        leaveTo: '-translate-y-full',
      },
      left: {
        enter: 'transform transition ease-out duration-300',
        enterFrom: '-translate-x-full',
        enterTo: 'translate-x-0',
        leave: 'transform transition ease-in duration-200',
        leaveFrom: 'translate-x-0',
        leaveTo: '-translate-x-full',
      },
      right: {
        enter: 'transform transition ease-out duration-300',
        enterFrom: 'translate-x-full',
        enterTo: 'translate-x-0',
        leave: 'transform transition ease-in duration-200',
        leaveFrom: 'translate-x-0',
        leaveTo: 'translate-x-full',
      },
      center: {
        enter: 'transform transition ease-out duration-300',
        enterFrom: 'opacity-0 scale-75',
        enterTo: 'opacity-100 scale-100',
        leave: 'transform transition ease-in duration-200',
        leaveFrom: 'opacity-100 scale-100',
        leaveTo: 'opacity-0 scale-75',
      },
      none: {
        enter: 'transition-opacity duration-300',
        enterFrom: 'opacity-0',
        enterTo: 'opacity-100',
        leave: 'transition-opacity duration-200',
        leaveFrom: 'opacity-100',
        leaveTo: 'opacity-0',
      },
    },
  },
  toast: {
    toast: 'z-[5000]',
    mask: {
      base: 'bg-black/0',
      maskClickable: 'pointer-events-none',
      noMaskClickable: 'pointer-events-auto',
    },
    body: {
      base: 'bg-transparent left-1/2 -translate-x-1/2 w-[80vw] max-h-[80vh]',
      position: {
        top: 'top-[20%]',
        center: 'top-1/2 -translate-y-1/2',
        bottom: 'bottom-[20%]',
      },
    },
    content: {
      wrap: 'mx-auto w-fit min-w-[120px] rounded-lg bg-black/70 px-4 py-3',
      text: 'break-words text-center text-sm text-white',
    },
  },
  popover: {
    index: {
      base: 'inline-block',
      popup: {
        base: 'absolute',
        mask: {
          base: 'bg-black/0',
          maskClickable: 'pointer-events-none',
          noMaskClickable: 'pointer-events-auto',
        },
        body: 'bg-transparent static',
        floating: {
          base: 'z-0',
        },
        floatingWrap: {
          base: 'relative',
          direction: {
            top: 'flex flex-col items-center',
            bottom: 'flex flex-col-reverse items-center',
            left: 'flex flex-row items-center',
            right: 'flex flex-row-reverse items-center',
            'top-start': 'flex flex-col items-start',
            'top-end': 'flex flex-col items-end',
            'bottom-start': 'flex flex-col-reverse items-start',
            'bottom-end': 'flex flex-col-reverse items-end',
            'left-start': 'flex flex-row items-start',
            'left-end': 'flex flex-row items-end',
            'right-start': 'flex flex-row-reverse items-start',
            'right-end': 'flex flex-row-reverse items-end',
          },
        },
        floatingContent: [
          'rounded-lg p-3',
          'shadow-[0_0_30px_0_rgba(0,0,0,.2)]',
          'bg-white text-left',
        ],
        floatingArrow: 'relative z-0',
        floatingArrowDirection: {
          base: 'w-0 h-0 relative',
          direction: {
            // 上方位置的箭头指向下方
            top: 'mx-auto border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
            'top-start':
              'ml-4 border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
            'top-end':
              'mr-4 ml-auto border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',

            // 下方位置的箭头指向上方
            bottom:
              'mx-auto border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
            'bottom-start':
              'ml-4 border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
            'bottom-end':
              'mr-4 ml-auto border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',

            // 左侧位置的箭头指向右侧
            left: 'my-auto border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
            'left-start':
              'mt-4 border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
            'left-end':
              'mb-4 mt-auto border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',

            // 右侧位置的箭头指向左侧
            right:
              'my-auto border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
            'right-start':
              'mt-4 border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
            'right-end':
              'mb-4 mt-auto border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
          },
        },
      },
    },
  },
  checkbox: {
    checkbox: [
      'group relative flex items-center focus:outline-none',
      '[&:not(:last-child)]:mr-1.5',
      'active:opacity-80',
      'data-[disabled]:opacity-40',
    ],
    box: [
      'relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors',
      'border-gray-300 bg-white',
      'group-data-[checked]:border-blue-600 group-data-[checked]:bg-blue-600',
      'group-data-[disabled]:cursor-not-allowed',
      'group-data-[hover]:hover:border-blue-500',
    ],
    checked: 'absolute h-3 w-3 text-white',
    label: [
      'ml-2 cursor-pointer select-none',
      'text-gray-700',
      'group-data-[disabled]:cursor-not-allowed',
    ],
    group: 'flex flex-wrap',
    icon: 'h-3 w-3',
  },
  radio: {
    group: 'flex flex-wrap',
    radio: [
      'group relative flex items-center focus:outline-none',
      '[&:not(:last-child)]:mr-1.5',
      'active:opacity-80',
      'data-[disabled]:opacity-40',
    ],
    radioBox: [
      'relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors',
      'border-gray-300 bg-white',
      'group-data-[checked]:border-blue-600',
      'group-data-[disabled]:cursor-not-allowed',
      'group-data-[hover]:hover:border-blue-500',
    ],
    radioDot: 'absolute h-2.5 w-2.5 rounded-full bg-blue-600',
    radioLabel: [
      'ml-2 cursor-pointer select-none',
      'text-gray-700',
      'group-data-[disabled]:cursor-not-allowed',
    ],
  },
  textarea: {
    textareaWrap: 'relative',
    textarea: {
      base: [
        'w-full resize-none rounded-md border border-gray-300 px-3 py-2',
        'text-base text-gray-700 placeholder:text-gray-400',
        'focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40',
        'read-only:bg-gray-50',
      ],
      noReadOnly: 'focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
    },
    count: 'absolute bottom-1 right-2 text-xs text-gray-400',
  },
  switch: {
    switch: 'flex items-center',
    switchTrack: [
      'group relative inline-flex shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out',
      'focus:outline-none',
      'border-gray-200 bg-white px-[1px]',
      'data-[checked]:border-blue-600 data-[checked]:bg-blue-600',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
      // track
      'h-[30px] min-w-[54px]',
    ],
    switchChildrenWrap: 'flex h-full w-full items-center justify-between',
    switchCheckedText:
      'mx-2 hidden text-xs text-white transition-opacity duration-200 group-data-[checked]:inline',
    switchThumb: [
      'pointer-events-none rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      'flex items-center justify-center',
      'border border-gray-200',
      // thumb 滑块尺寸
      'h-[24px] w-[24px]',
      // translate
      'translate-x-0',
      'group-data-[checked]:translate-x-[calc(100%-24px)]',
    ],
    switchUncheckedText:
      'mx-2 inline text-xs text-gray-700 transition-opacity duration-200 group-data-[checked]:hidden',
    icons: [
      'animate-spin',
      'h-[14px] w-[14px]',
      'text-gray-400 group-data-[checked]:text-blue-600',
    ],
  },
  list: {
    list: {
      base: 'bg-white',
      defaultScrollHeight: 'h-[300px]',
      isScroll: 'overflow-y-auto',
    },
    item: [
      'flex items-center px-4 py-3',
      'data-[clickable]:cursor-pointer data-[clickable]:active:bg-gray-50',
      'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
    ],
    itemPrefix: 'mr-3',
    itemSuffix: 'ml-3',
    itemContent: {
      wrap: 'flex-1',
      title: 'text-base text-gray-900',
      description: 'mt-1 text-sm text-gray-500',
    },
    defaultInfiniteScrollContentConfig: {
      wrap: 'h-[30px] text-center text-sm leading-[30px] text-gray-500',
      retry: 'text-blue-500 ml-2 cursor-pointer',
    },
  },
  mask: {
    transition: {
      enter: 'transition-opacity duration-300',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'transition-opacity duration-200',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0',
    },
    content: 'fixed inset-0 z-[1000] bg-black/70',
  },
  loading: {
    mask: 'bg-black/0',
    position: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    body: 'flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-black/70 text-white',
    text: 'mt-2 text-sm',
    loadingIcon: 'h-10 w-10 animate-spin',
  },
  useLockScroll: {
    bodyLockClass: 'overflow-hidden',
  },
  skeleton: {
    skeleton: {
      base: [
        'bg-gradient-to-r from-[#bebebe]/[0.2] from-25% via-[#818181]/[0.37] via-[37%] to-[#bebebe]/[0.2] to-[63%]',
        'bg-[length:400%_100%]',
        'rounded w-full h-5',
      ],
      animation: 'animate-[shimmer_1.4s_ease_infinite]',
    },
    paragraph: {
      list: 'space-y-2',
      item: 'last:w-[60%]',
    },
    circular: 'rounded-full size-[40px]',
  },
  badge: {
    index: {
      wrap: 'relative inline-block',
      base: [
        'inline-flex items-center justify-center',
        'font-medium px-[4.5px] py-[1px]',
        'rounded-full',
        'bg-red-500 text-white',
        'absolute -right-1 -top-1 text-[8px]',
      ],
      dot: 'size-3 p-0',
      onlyBadge: 'static',
    },
  },
  steps: {
    container: {
      base: 'flex',
      direction: {
        horizontal: 'flex-row items-start',
        vertical: 'flex-col',
      },
    },
    item: {
      base: 'group flex',
      direction: {
        horizontal: 'flex-1 items-center',
        vertical: '',
      },
    },
    itemInner: [
      'flex',
      'group-data-[is-clickable=true]:cursor-pointer',
      'group-data-[disabled=true]:cursor-not-allowed',
      'group-data-[direction=horizontal]:w-full',
      'group-data-[direction=horizontal]:flex-col',
      'group-data-[direction=vertical]:flex-grow',
    ],
    indicatorContainer: {
      horizontal: {
        base: 'relative flex h-6 w-full items-center justify-center',
        leftLine: [
          'absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2',
          'transition-colors duration-200',
          'bg-gray-300',
          'group-data-[previous-status=finish]:bg-blue-500',
        ],
        rightLine: [
          'absolute right-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2',
          'transition-colors duration-200',
          'bg-gray-300',
          'group-data-[status=finish]:bg-blue-500',
        ],
      },
      vertical: {
        base: 'flex flex-col items-center',
        line: [
          'w-0.5 flex-1 transition-colors duration-200',
          'bg-gray-300',
          'group-data-[status=finish]:bg-blue-500',
        ],
      },
    },
    icon: {
      base: [
        'flex items-center justify-center',
        'transition-all duration-200',
        'z-[1]',
      ],
      defaultIcon: [
        'size-3 rounded-full',
        'group-data-[status=wait]:bg-gray-300',
        'group-data-[status=process]:bg-blue-500',
        'group-data-[status=finish]:bg-blue-500',
        'group-data-[status=error]:bg-red-500',
      ],
    },
    content: [
      'group-data-[direction=horizontal]:mt-2 ',
      'group-data-[direction=vertical]:ml-3',
      'group-data-[direction=vertical]:flex-1',
      'group-data-[direction=vertical]:pb-6',
      'group-data-[direction=vertical]:text-left',
      'group-data-[disabled=true]:opacity-50',
    ],
    title: [
      'text-sm font-medium transition-colors duration-200',
      'group-data-[status=wait]:text-gray-400',
      'group-data-[status=process]:text-blue-600',
      'group-data-[status=finish]:text-gray-600',
      'group-data-[status=error]:text-red-600',
    ],
    description: [
      'text-xs mt-1 transition-colors duration-200',
      'group-data-[status=wait]:text-gray-400',
      'group-data-[status=process]:text-gray-600',
      'group-data-[status=finish]:text-gray-600',
      'group-data-[status=error]:text-red-600',
    ],
  },
};
export { defaultConfig };
