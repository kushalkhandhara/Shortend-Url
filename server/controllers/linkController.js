import { nanoid } from 'nanoid'; 
import Link from '../models/Link.js';
import Click from '../models/Click.js';
import User from '../models/User.js';

// Create shortened link
export const createLink = async (req, res) => {
  const { originalUrl, customAlias, expirationDate } = req.body;

  // Basic validations
  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  try {
    new URL(originalUrl); // validate if it's a valid URL
  } catch {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  if (expirationDate) {
    const expDate = new Date(expirationDate);
    if (isNaN(expDate.getTime())) {
      return res.status(400).json({ message: 'Invalid expiration date format' });
    }
    if (expDate < new Date()) {
      return res.status(400).json({ message: 'Expiration date cannot be in the past' });
    }
  }

  // Generate shortened URL using nanoid or custom alias
  const shortUrl = `${process.env.API_URL}/${customAlias || nanoid(7)}`;

  try {
    // Check if customAlias already exists
    if (customAlias) {
      const existing = await Link.findOne({ shortUrl });
      if (existing) {
        return res.status(400).json({ message: 'Custom alias already in use' });
      }
    }

    // Save the new link in the database
    const newLink = new Link({
      originalUrl,
      shortUrl,
      userId: req.userId,  // Assuming userId is available from JWT middleware
      expirationDate,
      clicks: 0,  // Initialize clicks to 0
    });

    await newLink.save();

   
    res.status(200).json({
      message: 'Shortened link created successfully',
      "short-url" : shortUrl,
      "original-url" : originalUrl,
      "expiration-date" : expirationDate,
    });
  } catch (error) {
    console.error('Error creating shortened link:', error);
    res.status(500).json({ message: 'Server error while creating link' });
  }
};

// Redirect to original URL and log the click
// export const redirectToOriginalUrl = async (req, res) => {
//   const { shortId } = req.params;
//   const shortUrl = `https://yourdomain.com/${shortId}`;
  
//   try {
//     const link = await Link.findOne({ shortUrl });

//     if (!link) {
//       return res.status(404).json({ message: 'Link not found' });
//     }

//     // Log the click
//     const clickData = new Click({
//       linkId: link._id,
//       deviceType: req.header('User-Agent'),
//       ipAddress: req.ip,
//     });

//     await clickData.save();

//     // Increment click count
//     link.clicks += 1;
//     await link.save();

//     res.redirect(link.originalUrl);
//   } catch (error) {
//     console.error('Error redirecting to original URL:', error);
//     res.status(500).json({ message: 'Server error while redirecting' });
//   }
// };

// export const redirectToOriginalUrl = async (req, res) => {
//   const { linkId } = req.params; // Use linkId from the URL parameters
  
//   try {
//     // Find the link by linkId instead of shortUrl
//     const link = await Link.findById(linkId);

//     if (!link) {
//       return res.status(404).json({ message: 'Link not found' });
//     }

//     // Log the click
//     const clickData = new Click({
//       linkId: link._id,
//       deviceType: req.header('User-Agent'),
//       ipAddress: req.ip,
//     });

//     await clickData.save();

//     // Increment click count
//     link.clicks += 1;
//     await link.save();

//     // Redirect to the original URL
//     // res.redirect(link.originalUrl);

//     res.status(200).json({
//       message : "Redirect to Original URL",
//       originalUrl : link.originalUrl,
//       success : true
//     })

//   } catch (error) {
//     console.error('Error redirecting to original URL:', error);
//     res.status(500).json({ message: 'Server error while redirecting' });
//   }
// };


// Get all links for a user
export const getUserLinks = async (req, res) => {
  
  try {
    const { userId } = req.params;

    if(!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if(userId.trim()===""){
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if the user exists in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all links associated with the userId
    const links = await Link.find({ userId });

    return res.status(200).json({
      "links" : links,
      "message" : "Links fetched successfully"
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getLinkDetails = async (req, res) => {
  
  try {
    const { linkId } = req.params;   
    const { userId } = req.params;    

    // Find the link by its linkId and populate the necessary fields
    const link = await Link.findById(linkId)

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Check if the link belongs to the user
    if (link.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this link' });
    }

    // Fetch the click data associated with the linkId
    const clicks = await Click.find({ linkId })
      .select('deviceType ipAddress timestamp')  // Specify the fields you want from the click data
      .exec();

    // Return the response with both link and click details
    return res.status(200).json({
      "linkDetails" : link,
      "clicks" : clicks,
      "message" : "Data Fetched Successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};