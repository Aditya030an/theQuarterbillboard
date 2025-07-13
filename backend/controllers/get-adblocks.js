import AdBlock from "../models/adblock.js";

export default async function getAdBlocks(req, res) {
  try {
    // Fetch all ad blocks from the database
    const adBlocks = await AdBlock.find().populate("adOwner", "username email");

    // Check if any ad blocks were found
    if (adBlocks.length === 0) {
      return res.status(404).json({ success: false, message: "No ad blocks found" });
    }

    // Return the only the array of pixels property from adblock
    return res.status(200).json({ success: true, adBlocks });
  } catch (error) {
    console.error("Error fetching ad blocks:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}