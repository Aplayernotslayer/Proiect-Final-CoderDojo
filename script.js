const GalleryImages = document.getElementById(gallery);

const images = [
    { src: "https://picsum.photos/300?1", name: "Test1" },
    { src: "https://picsum.photos/300?2", name: "Test2" },
    { src: "https://picsum.photos/300?3", name: "Test3" },
]

function renderGallery(images) {
    GalleryImages.innerHTML="";

    images.forEach(image => {
        const img = document.createElement("img")
        img.src = image.src
        img.alt = image.name

        gallery.appendChild(img)
    })
}

renderGallery(images);