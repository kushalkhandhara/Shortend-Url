import Link from '../models/Link.js';
import Click from '../models/Click.js';
 
export const redirectToOriginalUrl = async (req, res) => {
  const {shortName} = req.params;
  try {

  
    if(!shortName){
      return res.status(400).json({
          message : "Please Provide Name",
          success : false
      })
    }
    

    const shortUrl = `${process.env.API_URL}/${shortName}`;
    const linkData = await Link.findOne({ shortUrl });
    // console.log("linkdata : ",linkData)

    if (!linkData) {
      return res.status(404).json({ message: 'Link not found Please Enter Valid Short Name' });
    }

    // Log the click
    const clickData = new Click({
      linkId: linkData._id,
      deviceType: req.header('User-Agent'),
      ipAddress: req.ip,
    });

    await clickData.save();

    // Increment click count
    linkData.clicks += 1;
    await linkData.save();

    // Redirect to the original URL
    res.redirect(linkData.originalUrl);

    // res.status(200).json({
    //   message : "Redirect to Original URL",
    //   originalUrl : link.originalUrl,
    //   success : true
    // })

  } catch (error) {
    console.error('Error redirecting to original URL:', error);
    res.status(500).json({ message: 'Server error while redirecting' });
  }
};
