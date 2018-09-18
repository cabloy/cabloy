$(document).ready(function() {

  // query
  const query = util.parseUrlQuery();

  // title
  util.title();

  // menu active
  if (query.categoryId) {
    const link = $(`.category-${query.categoryId}`);
    link.parents('li').addClass('active');
  }

  // search text
  if (query.search) {
    $('form.search input').val(query.search);
  }

  // load more
  loadMore(query);

  // relatives
  relatives();

});

function relatives() {
  if (env.site.path === 'main/article') {
    _relatives('prev');
    _relatives('next');
  }
}

function _relatives(type) {
  // article
  const article = env.article;
  // options
  const options = {
    where: {
      'f.language': article.language,
      'f.categoryId': article.categoryId,
    },
    page: { index: 0, size: 1 },
    mode: 'list',
  };
  if (article.sorting > 0) {
    // asc for sorting
    options.where['f.sorting'] = { op: type === 'prev' ? '<' : '>', val: article.sorting };
    options.orders = [
      [ 'f.sorting', type === 'prev' ? 'desc' : 'asc' ],
    ];
  } else {
    // desc for createdAt
    options.where['f.createdAt'] = { op: type === 'prev' ? '>' : '<', val: this.ctx.meta.util.formatDateTime(article.createdAt) };
    options.orders = [
      [ 'f.createdAt', type === 'prev' ? 'asc' : 'desc' ],
    ];
  }
  // select
  util.ajax({
    url: '/a/cms/article/list',
    body: { options: JSON.stringify(options) },
  }).then(data => {
    _relative({ type, article: data.list[0] });
  });
}

function _relative({ type, article }) {
  if (!article) return;
  const $relative = $(`.relatives .${type}`);
  const $relativeLink = $(`.relatives .${type} a`);

  $relativeLink.attr('href', `${env.site.rootUrl}/${article.url}`);
  $relativeLink.text(article.atomName);
  $relative.removeClass('hidden');
}

function loadMore(query) {
  if (env.site.path === 'main/index/index') {
    _loadMore({});
  } else if (env.site.path === 'static/category') {
    _loadMore({
      categoryId: query.categoryId,
      search: query.search });
  }
}

function _loadMore({ categoryId, search }) {
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
          [ 'f.sticky', 'desc' ],
          [ 'a.createdAt', 'desc' ],
        ],
        page: { index },
        mode: 'list',
      };
      // categoryId
      if (categoryId) {
        options.where['f.categoryId'] = categoryId;
        options.orders = [
          [ 'f.sticky', 'desc' ],
          [ 'f.sorting', 'asc' ],
          [ 'a.createdAt', 'desc' ],
        ];
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
      const sticky = !item.sticky ? '' : '<span class="glyphicon glyphicon-pushpin"></span>';
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
      <h4 class="media-heading">${sticky} <a target="_blank" href="${env.site.rootUrl}/${item.url}">${item.atomName}</a></h4>
      ${item.description || item.summary}
    </div>
    ${media}
</li>
        `;
    },
  });
}
