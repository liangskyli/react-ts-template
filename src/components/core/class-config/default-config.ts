import { tv } from 'tailwind-variants/lite';

const getTwConfig = <T extends object = object>(obj: T) => {
  return obj;
};
const defaultConfig = getTwConfig({
  button: tv({
    slots: {
      button: [
        'inline-flex items-center justify-center focus:outline-none',
        'disabled:cursor-not-allowed disabled:before:hidden',
        'transition-colors duration-200',
        // 大小
        'px-4 py-2 text-sm',
        // 圆角
        'rounded-md before:rounded-md',
      ],
      loadingIcon: '-ml-1 mr-2 h-4 w-4 animate-spin',
      loadingIconCircle1: 'opacity-25',
      loadingIconCircle2: 'opacity-75',
    },
    variants: {
      variant: {
        primary: {
          button:
            'bg-blue-600 text-white hover:bg-blue-600 disabled:bg-blue-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        },
        secondary: {
          button:
            'bg-blue-100 text-blue-700 hover:bg-blue-100 disabled:bg-blue-50 disabled:text-blue-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        },
        danger: {
          button:
            'bg-red-600 text-white hover:bg-red-600 disabled:bg-red-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        },
        ghost: {
          button:
            'bg-white text-gray-700 border border-gray-300 hover:bg-white disabled:bg-gray-50 disabled:text-gray-400 relative before:absolute before:inset-0 before:opacity-0 active:before:opacity-[0.08] before:bg-black before:transition-opacity',
        },
      },
      block: {
        true: { button: 'w-full' },
      },
    },
  }),
  input: tv({
    base: [
      'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-700',
      'transition-colors duration-200',
      'read-only:bg-gray-50',
      'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40',
      'placeholder:text-gray-400',
      'outline-none',
    ],
    variants: {
      readOnly: {
        false: 'focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
      },
    },
  }),
  popup: tv({
    slots: {
      popupBase: 'fixed z-[1000]',
      mask: 'z-0',
      body: 'fixed z-0 overflow-auto bg-white',
      enter: '',
      enterFrom: '',
      enterTo: '',
      leave: '',
      leaveFrom: '',
      leaveTo: '',
    },
    variants: {
      position: {
        bottom: {
          body: 'bottom-0 left-0 right-0 max-h-[80vh]',
          enter: 'transform transition ease-out duration-300',
          enterFrom: 'translate-y-full',
          enterTo: 'translate-y-0',
          leave: 'transform transition ease-in duration-200',
          leaveFrom: 'translate-y-0',
          leaveTo: 'translate-y-full',
        },
        top: {
          body: 'top-0 left-0 right-0 max-h-[80vh]',
          enter: 'transform transition ease-out duration-300',
          enterFrom: '-translate-y-full',
          enterTo: 'translate-y-0',
          leave: 'transform transition ease-in duration-200',
          leaveFrom: 'translate-y-0',
          leaveTo: '-translate-y-full',
        },
        left: {
          body: 'left-0 top-0 bottom-0 max-w-[80vw]',
          enter: 'transform transition ease-out duration-300',
          enterFrom: '-translate-x-full',
          enterTo: 'translate-x-0',
          leave: 'transform transition ease-in duration-200',
          leaveFrom: 'translate-x-0',
          leaveTo: '-translate-x-full',
        },
        right: {
          body: 'right-0 top-0 bottom-0 max-w-[80vw]',
          enter: 'transform transition ease-out duration-300',
          enterFrom: 'translate-x-full',
          enterTo: 'translate-x-0',
          leave: 'transform transition ease-in duration-200',
          leaveFrom: 'translate-x-0',
          leaveTo: 'translate-x-full',
        },
        center: {
          body: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-h-[80vh]',
          enter: 'transform transition ease-out duration-300',
          enterFrom: 'opacity-0 scale-75',
          enterTo: 'opacity-100 scale-100',
          leave: 'transform transition ease-in duration-200',
          leaveFrom: 'opacity-100 scale-100',
          leaveTo: 'opacity-0 scale-75',
        },
        none: {
          // 不添加任何位置相关的样式
          body: '',
          enter: 'transition-opacity duration-300',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'transition-opacity duration-200',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        },
      },
    },
  }),
  toast: tv({
    slots: {
      toast: 'z-[5000]',
      mask: 'bg-black/0',
      body: 'bg-transparent left-1/2 -translate-x-1/2 w-[80vw] max-h-[80vh]',
      contentWrap:
        'mx-auto w-fit min-w-[120px] rounded-lg bg-black/70 px-4 py-3',
      contentText: 'break-words text-center text-sm text-white',
    },
    variants: {
      maskClickable: {
        true: { mask: 'pointer-events-none' },
        false: { mask: 'pointer-events-auto' },
      },
      position: {
        top: { body: 'top-[20%]' },
        center: { body: 'top-1/2 -translate-y-1/2' },
        bottom: { body: 'bottom-[20%]' },
      },
    },
  }),
  popover: tv({
    slots: {
      popoverBase: 'inline-block',
      floatingArrowDirection: 'w-0 h-0 relative',
      floating: 'z-0',
      floatingWrap: 'relative',
      floatingContent: [
        'rounded-lg p-3',
        'shadow-[0_0_30px_0_rgba(0,0,0,.2)]',
        'bg-white text-left',
      ],
      floatingArrow: 'relative z-0',
      mask: 'bg-black/0',
      popupBase: 'absolute',
      popupBody: 'bg-transparent static',
    },
    variants: {
      direction: {
        // 上方位置的箭头指向下方
        top: {
          floatingArrowDirection:
            'mx-auto border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
          floatingWrap: 'flex flex-col items-center',
        },
        'top-start': {
          floatingArrowDirection:
            'ml-4 border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
          floatingWrap: 'flex flex-col items-start',
        },
        'top-end': {
          floatingArrowDirection:
            'mr-4 ml-auto border-l-8 border-t-8 border-r-8 border-transparent mt-[-1px]',
          floatingWrap: 'flex flex-col items-end',
        },

        // 下方位置的箭头指向上方
        bottom: {
          floatingArrowDirection:
            'mx-auto border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
          floatingWrap: 'flex flex-col-reverse items-center',
        },
        'bottom-start': {
          floatingArrowDirection:
            'ml-4 border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
          floatingWrap: 'flex flex-col-reverse items-start',
        },
        'bottom-end': {
          floatingArrowDirection:
            'mr-4 ml-auto border-l-8 border-b-8 border-r-8 border-transparent mb-[-1px]',
          floatingWrap: 'flex flex-col-reverse items-end',
        },

        // 左侧位置的箭头指向右侧
        left: {
          floatingArrowDirection:
            'my-auto border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
          floatingWrap: 'flex flex-row items-center',
        },
        'left-start': {
          floatingArrowDirection:
            'mt-4 border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
          floatingWrap: 'flex flex-row items-start',
        },
        'left-end': {
          floatingArrowDirection:
            'mb-4 mt-auto border-t-8 border-l-8 border-b-8 border-transparent ml-[-1px]',
          floatingWrap: 'flex flex-row items-end',
        },

        // 右侧位置的箭头指向左侧
        right: {
          floatingArrowDirection:
            'my-auto border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
          floatingWrap: 'flex flex-row-reverse items-center',
        },
        'right-start': {
          floatingArrowDirection:
            'mt-4 border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
          floatingWrap: 'flex flex-row-reverse items-start',
        },
        'right-end': {
          floatingArrowDirection:
            'mb-4 mt-auto border-t-8 border-r-8 border-b-8 border-transparent mr-[-1px]',
          floatingWrap: 'flex flex-row-reverse items-end',
        },
      },
      maskClickable: {
        true: { mask: 'pointer-events-none' },
        false: { mask: 'pointer-events-auto' },
      },
    },
  }),
  checkbox: tv({
    slots: {
      group: 'flex flex-wrap',
      icon: 'h-3 w-3',
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
        'group-data-[indeterminate]:border-blue-600 group-data-[indeterminate]:bg-blue-600',
        'group-data-[disabled]:cursor-not-allowed',
        'group-data-[hover]:hover:border-blue-500',
      ],
      checked: 'absolute h-3 w-3 text-white',
      label: [
        'ml-2 cursor-pointer select-none',
        'text-gray-700',
        'group-data-[disabled]:cursor-not-allowed',
      ],
    },
  }),
  radio: tv({
    slots: {
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
  }),
  textarea: tv({
    slots: {
      textareaWrap: 'relative',
      textarea: [
        'w-full resize-none rounded-md border border-gray-300 px-3 py-2',
        'text-base text-gray-700 placeholder:text-gray-400',
        'focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-40',
        'read-only:bg-gray-50',
      ],
      count: 'absolute bottom-1 right-2 text-xs text-gray-400',
    },
    variants: {
      readOnly: {
        false: {
          textarea: 'focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
        },
      },
    },
  }),
  switch: tv({
    slots: {
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
  }),
  list: tv({
    slots: {
      defaultInfiniteScrollContentWrap:
        'h-[30px] text-center text-sm leading-[30px] text-gray-500',
      defaultInfiniteScrollContentRetry: 'text-blue-500 ml-2 cursor-pointer',
      list: 'bg-white',
      item: [
        'flex items-center px-4 py-3',
        'data-[clickable]:cursor-pointer data-[clickable]:active:bg-gray-50',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
      ],
      itemPrefix: 'mr-3',
      itemSuffix: 'ml-3',
      itemContentWrap: 'flex-1',
      itemContentTitle: 'text-base text-gray-900',
      itemContentDescription: 'mt-1 text-sm text-gray-500',
      virtualGrid: 'h-full w-full',
    },
    variants: {
      defaultScrollHeight: {
        true: { list: 'h-[300px]' },
      },
      isScroll: {
        true: { list: 'overflow-y-auto' },
      },
    },
  }),
  mask: tv({
    slots: {
      content: 'fixed inset-0 z-[1000] bg-black/70',
      transitionEnter: 'transition-opacity duration-300',
      transitionEnterFrom: 'opacity-0',
      transitionEnterTo: 'opacity-100',
      transitionLeave: 'transition-opacity duration-200',
      transitionLeaveFrom: 'opacity-100',
      transitionLeaveTo: 'opacity-0',
    },
  }),
  loading: tv({
    slots: {
      mask: 'bg-black/0',
      position: 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
      body: 'flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-black/70 text-white',
      text: 'mt-2 text-sm',
      loadingIcon: 'h-10 w-10 animate-spin',
    },
  }),
  useLockScroll: {
    bodyLockClass: 'overflow-hidden',
  },
  skeleton: tv({
    slots: {
      skeleton: [
        'bg-gradient-to-r from-[#bebebe]/[0.2] from-25% via-[#818181]/[0.37] via-[37%] to-[#bebebe]/[0.2] to-[63%]',
        'bg-[length:400%_100%]',
        'rounded w-full h-5',
      ],
      circular: 'rounded-full size-[40px]',
      paragraphList: 'space-y-2',
      paragraphItem: 'last:w-[60%]',
    },
    variants: {
      animation: {
        true: { skeleton: 'animate-[shimmer_1.4s_ease_infinite]' },
      },
    },
  }),
  badge: tv({
    slots: {
      badge: [
        'inline-flex items-center justify-center',
        'font-medium px-[4.5px] py-[1px]',
        'rounded-full',
        'bg-red-500 text-white',
        'absolute -right-1 -top-1 text-[8px]',
      ],
      wrap: 'relative inline-block',
      onlyBadge: 'static',
    },
    variants: {
      isDot: {
        true: { badge: 'size-3 p-0' },
      },
    },
  }),
  steps: tv({
    slots: {
      icon: [
        'flex items-center justify-center',
        'transition-all duration-200',
        'z-[1]',
      ],
      content: [
        'group-data-[direction=horizontal]:mt-2 ',
        'group-data-[direction=vertical]:ml-3',
        'group-data-[direction=vertical]:flex-1',
        'group-data-[direction=vertical]:pb-6',
        'group-data-[direction=vertical]:text-left',
        'group-data-[disabled]:opacity-50',
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
      container: 'flex',
      item: 'group flex',
      itemInner: [
        'flex',
        'group-data-[clickable]:cursor-pointer',
        'group-data-[disabled]:cursor-not-allowed',
        'group-data-[direction=horizontal]:w-full',
        'group-data-[direction=horizontal]:flex-col',
        'group-data-[direction=vertical]:flex-grow',
      ],
      indicatorContainerBase: '',
      indicatorContainerLeftLine: '',
      indicatorContainerRightLine: '',
      indicatorContainerLine: '',
    },
    variants: {
      isDefaultIcon: {
        true: {
          icon: [
            'size-3 rounded-full',
            'group-data-[status=wait]:bg-gray-300',
            'group-data-[status=process]:bg-blue-500',
            'group-data-[status=finish]:bg-blue-500',
            'group-data-[status=error]:bg-red-500',
          ],
        },
      },
      direction: {
        horizontal: {
          container: 'flex-row items-start',
          item: 'flex-1 items-center',
          indicatorContainerBase:
            'relative flex h-6 w-full items-center justify-center',
          indicatorContainerLeftLine: [
            'absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2',
            'transition-colors duration-200',
            'bg-gray-300',
            'group-data-[previous-status=finish]:bg-blue-500',
          ],
          indicatorContainerRightLine: [
            'absolute right-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2',
            'transition-colors duration-200',
            'bg-gray-300',
            'group-data-[status=finish]:bg-blue-500',
          ],
        },
        vertical: {
          container: 'flex-col',
          item: '',
          indicatorContainerBase: 'flex flex-col items-center',
          indicatorContainerLine: [
            'w-0.5 flex-1 transition-colors duration-200',
            'bg-gray-300',
            'group-data-[status=finish]:bg-blue-500',
          ],
        },
      },
    },
  }),
  tree: tv({
    slots: {
      node: [
        'flex items-center',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
      ],
      nodeContentWrap:
        'flex-1 flex items-center py-1 text-sm text-gray-900 select-none',
      nodeContentIndent: 'flex-shrink-0',
      nodeContentSwitcher:
        'flex-shrink-0 size-6 flex items-center justify-center mr-1 data-[can-expand]:cursor-pointer',
      children: 'ml-6',
      treeRadio: 'block',
      defaultExpandIcon: 'h-4 w-4 transition-transform duration-200',
      defaultCollapseIcon:
        'h-4 w-4 rotate-90 transition-transform duration-200',
    },
  }),
  searchBar: tv({
    slots: {
      container: ['flex items-center'],
      search: ['relative flex items-center w-full'],
      searchIcon: [
        'absolute z-0 left-3 top-1/2 transform -translate-y-1/2',
        'size-4 text-gray-400 pointer-events-none',
      ],
      clearButton: [
        'absolute z-0 right-3 top-1/2 transform -translate-y-1/2',
        'size-4 text-gray-400 cursor-pointer',
        'hover:text-gray-600 transition-colors duration-200',
      ],
      input: ['data-[search-icon]:pl-8', 'data-[clear-icon]:pr-8'],
    },
  }),
  virtualGrid: tv({
    slots: {
      container: 'relative',
      header: 'absolute left-0 right-0 top-0',
      leftHeader: 'absolute left-0 top-0',
      centerHeader: 'absolute top-0',
      rightHeader: 'absolute right-0 top-0',
      body: 'absolute left-0 right-0',
      leftBody: 'absolute left-0 top-0',
      centerBody: 'absolute top-0',
      rightBody: 'absolute right-0 top-0',
    },
  }),
  virtualTable: tv({
    slots: {
      container: 'border border-gray-200',
      rightHeaderClass: 'border-l border-gray-200',
      rightBodyClass: 'border-l border-gray-200',
      headerCellClass:
        'flex h-full items-center border-b border-r border-gray-200 bg-gray-50 px-2',
      bodyCellClass: 'h-full border-b border-r border-gray-200 px-2',
    },
  }),
  viewerPdf: tv({
    slots: {
      container: 'flex flex-col data-[tool-bar]:border',
      toolBarWrap: 'flex items-center justify-end bg-gray-100',
      toolBarZoomButton: 'p-2 data-[disabled]:text-gray-400 focus:outline-none',
      toolBarResetZoomButton: 'w-12 py-1 text-sm focus:outline-none',
      document: [
        'text-center bg-white overflow-auto',
        'flex flex-col items-center',
      ],
      page: 'after:shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] after:absolute after:inset-[10px]',
    },
  }),
});
export { defaultConfig };
