import AdBlock from '../models/adblock.js'; 

export default async function createAdBlock(req, res) {
  try {
    const { adOwner, startingPixel, rows, cols, price, pixels } = req.body;

    // Validate input
    if (!adOwner || !startingPixel || !rows || !cols || !price || !pixels || req.file === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const imageURL =  req.file.path // Use uploaded file path if available

    // Create new ad block
    const newAdBlock = new AdBlock({
      adOwner,
      startingPixel,
      rows,
      cols,
      price,
      imageURL,
      pixels: JSON.parse(pixels)
    });

    // Save to database
    await newAdBlock.save();

    return res.status(201).json(newAdBlock);
  } catch (error) {
    console.error('Error creating ad block:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}