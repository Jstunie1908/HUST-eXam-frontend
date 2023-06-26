export default function ImageGallery({ imageUrls }) {
  return (
    <div className="image-gallery">
      {imageUrls.map((imageUrl, index) => (
        <div key={index} className="image-wrapper">
          <img src={imageUrl} alt={`This is img ${index + 1}`} className="image" />
        </div>
      ))}
    </div>
  );
}
