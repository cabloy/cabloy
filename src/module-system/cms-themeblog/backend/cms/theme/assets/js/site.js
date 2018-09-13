$(document).ready(function() {
  // menu active
  const query = util.parseUrlQuery();
  if (query.categoryId) {
    const link = $(`.category-${query.categoryId}`);
    link.parents('li').addClass('active');
  }
});

