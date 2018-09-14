$(document).ready(function() {

  // menu active
  const query = util.parseUrlQuery();
  if (query.categoryId) {
    const link = $(`.category-${query.categoryId}`);
    link.parents('li').addClass('active');
  }

  // load more
  if (env.path === 'main/index/index') {
    util.loadMore({
      container: '.article-list',
      index: 0,
      onFetch({ index }) {
        return util.ajax({
          url: 'a/cms/jsonp/articleList',
          body: { index },
        });
      },
      onParse(item) {
        return `<div style="height:150px;">${item}</div>`;
      },
    });
  }
});

