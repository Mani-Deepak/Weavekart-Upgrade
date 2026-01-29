import api from '../api/client';

export const analyzeUserImage = async (file) => {
  try {
    const response = await api.analyzeFace(file);
    return {
      success: true,
      data: response.faces
    };
  } catch (error) {
    console.error("Analysis failed", error);
    return { success: false, error: error.message };
  }
};

export const recommendFromImage = async (file) => {
  // Legacy support or chain analysis + recommendation
  // For now, let's just analyze and then search based on detected attributes
  try {
    const analysis = await api.analyzeFace(file);
    const faces = analysis.faces;
    if (!faces || faces.length === 0) {
      return {
        success: false,
        error: "No face detected"
      };
    }

    // Use the first face attributes to build a query
    const face = faces[0];
    const description = `Outfit for ${face.gender} with ${face.skin_tone} skin tone and ${face.face_shape} face shape`;

    const recommendations = await api.recommendOutfits(description, face.gender);

    return {
      success: true,
      data: recommendations.recommendations.map(mapBackendToFrontend)
    };
  } catch (error) {
    console.error("Recommendation from image failed", error);
    return { success: false, error: error.message };
  }
};

export const recommendFromText = async (description, gender = null, topN = 10) => {
  try {
    const response = await api.recommendOutfits(description, gender, topN);
    return {
      success: true,
      data: response.recommendations.map(mapBackendToFrontend)
    };
  } catch (error) {
    console.error("Recommendation from text failed", error);
    return { success: false, error: error.message };
  }
};

// Helper mapper
const mapBackendToFrontend = (item) => ({
  id: item.product_id,
  title: item.name,
  // Use a placeholder if no image URL in dataset (dataset doesn't seem to have image URLs, only descriptions)
  // We might need to map categories to stock images or use the VR generated ones potentially?
  // For now, random Unsplash or based on category
  image: getPlaceholderImage(item.category),
  price: `₹${item.price}`,
  matchScore: `${item.matching_percentage}%`,
  reason: `Matches style: ${item.styles}, Occasion: ${item.occasions}`,
  // Keep raw data too
  ...item
});

const getPlaceholderImage = (category) => {
  const map = {
    'Saree': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80',
    'Kurta': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80',
    'Lehenga': 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80',
    'Dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
    'Shirt': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80'
  };

  // Simple substring match
  for (const key in map) {
    if (category && category.includes(key)) return map[key];
  }
  return 'https://images.unsplash.com/photo-1490481651871-732d88918128?auto=format&fit=crop&q=80';
};
