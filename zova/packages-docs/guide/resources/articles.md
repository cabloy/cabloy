# Articles

## [Vite: How to resolve bundle fragmentation?](https://dev.to/uncle-pushui/vite-how-to-resolve-bundle-fragmentation-3jm7)

> Summary: When we use Vite for bundle code files, we often encounter this problem: With the development of the business, there are more and more pages, more and more third-party dependencies, and the chunks are getting bigger and bigger. If the pages are imported dynamically, then all the files shared by several pages will be independently bundled to the same chunk, which will create a large number of tiny js chunk files, such as: 1K, 2K, 3K, which significantly increases the resource request of the browser
