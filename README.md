# online-image-cropper
`online-image-cropper` means two. Firstly, web page for interactive online cropping of images and secondly, PHP script for automated generation of cropped images.

Recommended usage is to open up interactive online app (`index.html`), perform required cropping interactivelly (using sliders and life preview) and then copy generated link to `crop.php` script.

`online-image-cropper` allows to crop image and also round corners. Both sites uses encapsulation via SVG and (if needed).

## GET params

Both of scripts uses GET params. Following are common for both of them:

 - `img` (url of image to be loaded)
 - `spec` (specification of crooping, in JSON)

where specification of crooping in JSON looks like:

    { 'crop': { 'top': 0.1, 'bot': 0.9, 'left': 0.2, 'right': 0.8 }, 'round': { 'round': 0.33 }}

	When used with `index.html` presets given data form (and preview). Also can be used with `redirect=whatever` which automatically redirects to generated outlink.

	Script `crop.php` can be invoked with optional param `size=<number>`, declaring size of the generated image (if no given, default, 400, is used).

## Future work

 - [ ] handle errors and failures (top < bot, left > right, image not found, ...)
 - [ ] add more edit oprations (brigthness, contrast, crop by polygon/drawing, ...)
 - [ ] make it more interactive (drag'n'drop in preview, ...)
 - [ ] add save/load (JSON spec)
 - [ ] avoid using DataURI or shorten it
