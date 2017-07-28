# online-image-cropper
Simple web (html &amp; js) tool for cropping (~~and optionally other image edit operations~~) just on-line, with no images upload/download.

## About

Simple online editor for images performing cropping (and also rounding image corners).

Firstly, insert URL of image to be cropped. By using four spinners specify top, bottom, left and right crop, and optionally specify corners' rounding radius. `oic` automatically and intteractivelly updates the preview and updates generated DataURL. This URL encapsulates the input image with the specified crops and can be simply copied and inserted where needed.

Application runs, as expected, by running the `index.html` file.

## Web page api
File `index.html` accepts optional GET parameters:

	- `img` (url of image to be loaded)
	- `spec` (specification of crooping, in JSON, see later)
	- `redirect` (arbitrary value, just makes page redirect to outputed image)

Specification of crooping in JSON looks like:

    { 'crop': { 'top': 10, 'bot': 20, 'left': 30, 'right': 40 }, 'round': { 'round': 50 }}

## Future work

	- [ ] handle errors and failures (top < bot, left > right, image not found, ...)
	- [ ] add more edit oprations (brigthness, contrast, crop by polygon/drawing, ...)
	- [ ] make it more interactive (drag'n'drop in preview, ...)
	- [ ] add save/load (JSON spec)
