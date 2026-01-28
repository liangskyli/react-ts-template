# SearchBar 搜索框

基于项目现有Input组件实现的搜索框组件，类似antd-mobile的SearchBar设计，支持搜索图标、清除按钮。继承了Input组件的所有功能特性。

## 代码演示

### 基础用法

```tsx
import SearchBar from '@/components/core/components/search-bar';

export default () => (
  <SearchBar placeholder="请输入搜索内容" />
);
```

### 受控组件

```tsx
import { useState } from 'react';
import SearchBar from '@/components/core/components/search-bar';

export default () => {
  const [value, setValue] = useState('');
  
  return (
    <SearchBar 
      value={value} 
      onChange={setValue} 
      onSearch={(val) => console.log('搜索:', val)}
      placeholder="请输入搜索内容"
    />
  );
};
```

### 自定义配置

```tsx
import SearchBar from '@/components/core/components/search-bar';

export default () => (
  <>
    <SearchBar
      showSearchIcon={false}
      placeholder="不显示搜索图标"
    />
    <SearchBar
      showClearButton={false}
      placeholder="不显示清除按钮"
    />
    <SearchBar
      maxLength={20}
      placeholder="最多输入20个字符"
    />
  </>
);
```

### 继承Input组件功能

```tsx
import SearchBar from '@/components/core/components/search-bar';

export default () => (
  <>
    <SearchBar
      type="email"
      placeholder="邮箱搜索"
    />
    <SearchBar
      inputMode="decimal"
      placeholder="数字搜索"
      decimalPlaces={2}
    />
  </>
);
```

### 禁用和只读状态

```tsx
import SearchBar from '@/components/core/components/search-bar';

export default () => (
  <>
    <SearchBar
      disabled
      value="禁用状态"
      placeholder="请输入搜索内容"
    />
    <SearchBar
      readOnly
      value="只读状态"
      placeholder="请输入搜索内容"
    />
  </>
);
```

### 事件处理

```tsx
import SearchBar from '@/components/core/components/search-bar';

export default () => (
  <SearchBar 
    placeholder="请输入搜索内容"
    onChange={(value) => console.log('输入变化:', value)}
    onSearch={(value) => console.log('搜索:', value)}
    onClear={() => console.log('清除内容')}
    onFocus={() => console.log('获得焦点')}
    onBlur={() => console.log('失去焦点')}
  />
);
```

## API

### 属性

SearchBar组件继承了Input组件的所有属性，并添加了以下特有属性：

| 属性                     | 说明                  | 类型                                  | 默认值              |
|------------------------|---------------------|-------------------------------------|------------------|
| `showSearchIcon`       | 是否显示搜索图标            | `boolean`                           | `true`           |
| `searchIcon`           | 自定义搜索图标             | `ReactNode`                         | `<SearchIcon />` |
| `showClearButton`      | 是否显示清除按钮            | `boolean`                           | `true`           |
| `clearIcon`            | 自定义清除图标             | `ReactNode`                         | `<ClearIcon />`  |
| `className`            | 自定义容器类名 或 语义化的类名   | `string \| SemanticClassNames`      | -                |
| `inputClassName`       | Input组件的类名          | `string`                            | -                |
| `searchClassName`      | 搜索框的类名              | `string`                            | -                |
| `searchIconClassName`  | 搜索图标类名              | `string`                            | -                |
| `clearButtonClassName` | 清除按钮类名              | `string`                            | -                |
| `onSearch`             | 搜索时的回调函数（按Enter键触发） | `(value: string) => void`           | -                |
| `onClear`              | 清除时的回调函数            | `() => void`                        | -                |

### SemanticClassNames Props

| 属性            | 说明        | 类型       | 默认值 |
|---------------|-----------|----------|-----|
| `root`        | 自定义容器类名   | `string` | -   |
| `input`       | Input组件的类名 | `string` | -   |
| `search`      | 搜索框的类名    | `string` | -   |
| `searchIcon`  | 搜索图标类名    | `string` | -   |
| `clearButton` | 清除按钮类名    | `string` | -   |

### 继承的Input属性

| 属性              | 说明                        | 类型                                                                                    | 默认值      |
|-----------------|---------------------------|---------------------------------------------------------------------------------------|----------|
| `value`         | 输入框的值                     | `string`                                                                              | -        |
| `defaultValue`  | 输入框默认值                    | `string`                                                                              | -        |
| `type`          | 输入框类型                     | `'text' \| 'password' \| 'number' \| 'tel' \| 'email' \| 'url'`                       | `'text'` |
| `onChange`      | 值变化时的回调函数                 | `(value: string) => void`                                                             | -        |
| `decimalPlaces` | 小数位数，只支持整数值               | `number`                                                                              | `2`      |
| `min`           | 最小值，小数位数不大于decimalPlaces位 | `number`                                                                              | `0`      |
| `max`           | 最大值，小数位数不大于decimalPlaces位 | `number`                                                                              | -        |
| `readOnly`      | 是否只读                      | `boolean`                                                                             | `false`  |
| `disabled`      | 是否禁用                      | `boolean`                                                                             | `false`  |
| `maxLength`     | 最大输入长度                    | `number`                                                                              | -        |
| `inputMode`     | 输入模式                      | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | -        |

以及所有原生input元素的属性（如 `placeholder`、`autoComplete` 等）。

## 样式定制

SearchBar 基于Input组件，继承了Input组件的所有样式特性：

- **Input样式**：继承Input组件的完整样式系统
- **搜索图标**：左侧灰色图标，绝对定位
- **清除按钮**：右侧可点击的清除图标，绝对定位

可以通过以下方式进行样式定制：

```tsx
<SearchBar
  className="custom-container-class"  // 容器样式
  inputClassName="custom-input-class"  // Input组件样式
/>
```

由于基于Input组件，SearchBar支持Input组件的所有样式特性，包括聚焦状态、禁用状态等。

## 交互行为

1. **搜索触发**：按Enter键或调用onSearch回调
2. **清除功能**：点击清除按钮清空输入内容并重新聚焦
3. **自动显示/隐藏**：清除按钮仅在有内容且非禁用/只读状态时显示

## 无障碍

- 支持键盘操作（Enter键搜索）
- 适当的焦点管理
- 语义化的HTML结构

## 继承特性

由于基于Input组件实现，SearchBar继承了Input组件的所有特性：

1. **数字输入支持**：支持`inputMode="decimal"`进行数字输入和格式化
2. **类型支持**：支持email、tel、url等输入类型
3. **验证功能**：支持min、max范围验证（数字输入时）
4. **无障碍支持**：继承Input组件的完整无障碍特性

## 注意事项

1. 当组件为受控组件时（提供了 `value` 属性），内部状态会跟随外部 `value` 变化
2. 清除按钮只在有输入内容且非禁用/只读状态时显示
3. 搜索功能通过按Enter键或调用onSearch回调触发
4. 组件完全基于现有的Input组件，保持一致的API风格和行为
5. 支持Input组件的所有功能，如数字输入、类型验证等
