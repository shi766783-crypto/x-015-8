// 菜谱可被搜索的字段：key 对应菜谱数据字段，label 用于在结果里提示命中位置
export const SEARCH_FIELDS = [
  { key: 'name', label: '菜名' },
  { key: 'category', label: '菜系' },
  { key: 'holder', label: '难度' },
  { key: 'number', label: '时间' },
  { key: 'location', label: '食材' },
  { key: 'copyLocation', label: '调料' },
  { key: 'notes', label: '小贴士' }
]

const normalize = (value) => String(value ?? '').toLowerCase()
const cleanKeyword = (keyword) => normalize(keyword).trim()

// 返回一条菜谱所有命中的字段 key；多个字段同时命中时会返回多个
export function matchFields(recipe, keyword) {
  const q = cleanKeyword(keyword)
  if (!q) return []
  return SEARCH_FIELDS.filter(({ key }) => normalize(recipe[key]).includes(q)).map(({ key }) => key)
}

// 搜索菜谱：关键字为空（或纯空格）时回到完整列表；
// 命中时给每条记录附加 matches / matchLabels，方便结果页提示命中了哪些字段
export function searchRecipes(recipes, keyword) {
  const q = cleanKeyword(keyword)
  if (!q) return recipes
  return recipes
    .map((recipe) => [recipe, matchFields(recipe, q)])
    .filter(([, fields]) => fields.length > 0)
    .map(([recipe, fields]) => ({
      ...recipe,
      matches: fields,
      matchLabels: SEARCH_FIELDS.filter(({ key }) => fields.includes(key)).map(({ label }) => label)
    }))
}

// 把文本按搜索词切成片段，用于高亮；大小写不敏感，片段保留原文写法
export function splitByQuery(text, keyword) {
  const source = String(text ?? '')
  const q = cleanKeyword(keyword)
  if (!source) return []
  if (!q) return [{ text: source, hit: false }]
  const lower = source.toLowerCase()
  const segments = []
  let cursor = 0
  let index = lower.indexOf(q, cursor)
  while (index !== -1) {
    if (index > cursor) segments.push({ text: source.slice(cursor, index), hit: false })
    segments.push({ text: source.slice(index, index + q.length), hit: true })
    cursor = index + q.length
    index = lower.indexOf(q, cursor)
  }
  if (cursor < source.length) segments.push({ text: source.slice(cursor), hit: false })
  return segments
}
