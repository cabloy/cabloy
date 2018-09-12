$(document).ready(function() {
  // menu active
  const query = util.parseUrlQuery();
  if (query.categoryId) {
    const li = $(`.category-${query.categoryId}`);
    li.addClass('active');
    li.parents('li').addClass('active');
  }
});

