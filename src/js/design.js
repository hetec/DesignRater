/**
 * Design Factory
 * 
 * Enables creation of Design objects
 */

const Design = (id, name, imageUrl) => {
  return {
    id: id,
    name: name,
    imageUrl: imageUrl
  }
}