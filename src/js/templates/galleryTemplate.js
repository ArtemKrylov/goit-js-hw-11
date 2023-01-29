export default function makeGalleryHTMLString(picturesArr) {
  return picturesArr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        downloads,
        comments,
      }) =>
        `
	<figure class="figure">
		<a href=${largeImageURL} class="figure__link">
			<img src="./images/placeholder.jpg" data-src=${webformatURL} class="lazyload figure__image blur-up" alt="${tags}" loading="lazy">
		</a>
		<figcaption class="figure__figcaption">
			<div class="figure__info-item">
				<b>Likes</b>
				<p>${likes}</p>
			</div>
			<div class="figure__info-item">
				<b>Views</b>
				<p>${views}</p>
			</div>
			<div class="figure__info-item">
				<b>Comments</b>
				<p>${comments}</p>
			</div>
			<div class="figure__info-item">
				<b>Downloads</b>
				<p>${downloads}</p>
			</div>
 		</figcaption>
	</figure>
	`
    )
    .join('');
}
