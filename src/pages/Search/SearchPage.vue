<template>
  <form action="/public">
<!--    标签搜索框-->
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索的标签"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <!--  Divider 分割线：用于将内容分隔为多个区域。-->
  <van-divider v-if="activeIds.length === 0">已选标签</van-divider>
  <!--  布局：都是行row嵌套 列col的
  通过 gutter 属性可以设置列元素之间的间距
  -->
  <van-row gutter="20">
    <van-col v-for="tagId in activeIds">
      <van-tag closeable size="small" type="primary" @close="doClose(tagId)">
        {{ tagId }}
      </van-tag>
    </van-col>
  </van-row>
  <van-divider content-position="left">选择标签</van-divider>
  <!--  v-model:main-active-index	左侧选中项的索引
  v-model:active-id	右侧选中项的 id，支持传入数组
  -->
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
<!--   根据标签去搜素 符合对应标签的用户-->
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>


</template>


<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from "vue-router";
const router = useRouter();


const searchText = ref('');
/**
 *  用户在搜索框中,输入标签名,我们会将对应的标签  (van-tree-select) 选项框中 显示
 */
// val就是接收搜索框中的搜索词的, 但是我们这里用不到了因为我们进行了表单和 数据模型双向绑定
const onSearch = () => {
  // 扁平化：就是将嵌套的数据结构（例如多维数组）展开，使之成为一个简单的一维列表或数组。
  // 这里就是映射成一个新的扁平化数组
  // 注意：用ref封装的响应式数据，一定要通过 .value的方式去取
  // 每次根据关键字搜索，记得遍历的是原始的标签列表（因为数据都是全的，不会出现越过滤越少的情况） -- 记得拷贝一下内容
  tagList.value = originTagList.map(parentTag => {
    /**
     * {...parentTag} 创建了一个 parentTag 对象的浅拷贝。
     * [...parentTag.children] 数组元素对象的浅拷贝
     * 拷贝后的新对象，地址不一样，所以我们修改的时候不会修改原对象
     * 这也保证了我们的 originTagList原数组里面的内容不会受影响，干净的
     */
    const tempParentTag = {...parentTag};
    const tempChildren = [...parentTag.children]
    // 过滤后的结果的要求是：符合item.text.includes(searchText.value)的要求，然后将符合要求的元素，重新赋值给 parentTag.children
    tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
    return tempParentTag;
  })

};
/**
 *  搜索栏的取消按钮
 */
const onCancel = () => {
  searchText.value = '';
  // 每次点击取消事件，记得将 tagList重置为原数组
  tagList.value = originTagList;
};

const show = ref(true);
const close = () => {
  show.value = false;
};
// 右侧选中项的 id，支持传入数组
const activeIds = ref([]);
// 左侧选中项的索引
const activeIndex = ref(0);
// 标签列表
// 记得弄一个原始的数组（要不然会出现过滤的  越来越少的情况，默认等于原始数组）
const originTagList = [
  {
    text: '性别',
    children: [
      // id 就是唯一标识，这里弄得和text标签名一样就可以了，都是唯一的
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
    ],
  },
  {
    text: '编程语言',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'C++', id: 'C++'},
    ],
  },
];

// 我们将tagList 弄成响应式的数据
// 响应式 可以理解为 实时更新（所以记得将const改为let）
let tagList = ref(originTagList);

// 移除标签
const doClose = (tagId) => {
  // 由于这个activeIds是ref引用类型，我们要获取对象本身通过value方法
  // 这里将 新数组覆盖原来的数组，新数组把 老数组中一些和要关闭的标签id不一样的元素过滤掉了，留下来的都是一样的id了
  activeIds.value = activeIds.value.filter(item => {
    // 注意：这里是过滤掉 不等于和自己传过来标签id不同的元素
    return item !== tagId; // 符合过滤要求，重新赋值给activeIds数组
  })
}
/**
 *  根据已选标签进行搜索对应的用户
 */
const doSearchResult = () => {
  // 注意router路由器对象是传参，而route路由地址对象是获取参数
  router.push({
    path: '/user/list',
    // query 是一个属性，表示要传递的查询参数。在 Vue Router 中，可以通过 query 属性来传递查询参数，这些参数会附加在 URL 中的查询字符串中。
    // {tags: activeIds.value}是query查询属性的对象，表示要传递的查询参数（以对象的形式）
    query: {
      // 使用 query 传递参数时，通常可以使用对象的形式
      // 例如形式：/search/list? tags=男&tags=女&tags=大二&tags=大三
      tags: activeIds.value
    }
  })
}


</script>


<style scoped>

</style>
