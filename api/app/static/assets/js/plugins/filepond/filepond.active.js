(function ($) {
    "use strict";

    /*File Pond*/
    if( $('.file-pond').length ) {
        FilePond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);
        const inputElement = document.querySelector('.file-pond');
        const pond = FilePond.create( inputElement, {
            imagePreviewHeight: 140,
            allowMultiple: true,
            name : 'images'
        });
    }

})(jQuery);
