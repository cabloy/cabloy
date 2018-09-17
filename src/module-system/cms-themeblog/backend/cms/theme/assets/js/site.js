$(document).ready(function() {

  // query
  const query = util.parseUrlQuery();

  // menu active
  if (query.categoryId) {
    const link = $(`.category-${query.categoryId}`);
    link.parents('li').addClass('active');
  }

  // load more
  if (env.site.path === 'main/index/index') {
    loadMore({});
  } else if (env.site.path === 'static/category') {
    loadMore({
      categoryId: query.categoryId,
      search: query.search });
  }

  // search text
  if (query.search) {
    $('form.search input').val(query.search);
  }

  // title
  util.title();

});

function loadMore({ categoryId, search }) {
  util.loadMore({
    container: '.article-list',
    index: (env.index && env.index[env.site.path]) || 0,
    onFetch({ index }) {
      // options
      const options = {
        where: {
          'f.language': env.language.current,
        },
        orders: [
          [ 'a.createdAt', 'desc' ],
        ],
        page: { index },
        mode: 'list',
      };
      // categoryId
      if (categoryId) {
        options.where['f.categoryId'] = categoryId;
      }
      // search
      if (search) {
        options.where['f.content'] = { val: search, op: 'like' };
        options.mode = 'search';
      }
      // select
      return util.ajax({
        url: '/a/cms/article/list',
        body: { options: JSON.stringify(options) },
      });
    },
    onParse(item) {
      const media = !item.imageFirst ? '' : `
<div class="media-right">
      <a target="_blank" href="${env.site.rootUrl}/${item.url}">
        <img class="media-object" src="${util.combineImageUrl(item.imageFirst, 125, 100)}">
      </a>
</div>
        `;
      return `
<li class="media">
    <div class="media-body">
      <h4 class="media-heading"><a target="_blank" href="${env.site.rootUrl}/${item.url}">${item.atomName}</a></h4>
      ${item.description || item.summary}
    </div>
    ${media}
</li>
        `;
    },
  });
}
