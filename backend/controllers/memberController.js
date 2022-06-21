const Member=require('../models/memberModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const sendEmail = require('../utils/sendEmail');
const cloudinary =require('cloudinary')



//Add Memebers

exports.addMember = catchAsyncErrors(async(req,res,next)=>{
    const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'members',
    })

    const member = await Member.create(req.body);
    member.avatar.public_id=myCloud.public_id,
    member.avatar.url=myCloud.secure_url,

   await member.setMembership();

   await member.save();
   const message=`Dear ${member.name} thank you for being our Gym Member ,
   Joining Date:${member.joining}
   Membership Start:${member.membershipStart}
   Membership End:${member.membershipEnd}`;
   try{
    await sendEmail({
        email:member.email,
        subject:`New Gym Membersip`,
        message,

    });

    res.status(200).json({
        success:true,
        message:`Email sent to ${member.email} successfully `,
    });

}
catch(error){


  await member.save({validateBeforeSave:false});
  return next(new ErrorHandler(error.message,500));
}

    res.status(201).json({
        success:true,
        member,
        message:'Member Added Successfully'
    });


});
//Get all members--Admin

exports.getAllMembers=catchAsyncErrors(async (req,res)=>{

    const resultPerPage=10;
    const memberCount=await Member.countDocuments();

  const apiFeature= new  ApiFeatures(Member.find(),req.query)
  .search()
  .filter()
  .pagination(resultPerPage)

    const members= await apiFeature.query;
     res.status(200).json({
         success:true,
         members,
         memberCount
         
     })
     
 });
exports.searchMembers=catchAsyncErrors(async (req,res)=>{

    const members= await Member.find({
        name: { $regex: req.query.name, $options: "i" },
    })
     res.status(200).json({
         success:true,
         members,
         
     })
     
 });

//Get Member Details
exports.getMemberDetails=catchAsyncErrors(async(req,res,next)=>{
    const member=await Member.findById(req.params.id);
    if(!member){
        return next(new ErrorHandler("Member not found",404))
      
 
     }

     res.status(200).json({
        success:true,
        member
    })



})



//Update Members

exports.updateMember=catchAsyncErrors(async(req,res,next)=>{
    let member=await Member.findById(req.params.id);
    if(!member){
       return res.status(500).json({
            success:false,
            message:'Member not found'
        })

    }

    member=await Member.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindModify:false,
    });
    console.log('Hey I got executed');

    res.status(200).json({
        success:true,
        member,
        message:'Member Updated Successfully'
    })

})

//Delete Member 
exports.deleteMember=catchAsyncErrors(async(req,res,next)=>{

    const member=await Member.findById(req.params.id);
    if(!member){
        return res.status(500).json({
             success:false,
             message:'Member not found'
         })
 
     }
     await cloudinary.v2.uploader.destroy(member.avatar.public_id)

     await member.remove();

     res.status(200).json({
        success:true,
        message:"Member Removed Successfully"
    })

}
)
//Recharge Subscription
exports.recharge=catchAsyncErrors(async(req,res,next)=>{
 
    let member=await Member.findById(req.params.id);
    if(!member){
        return res.status(500).json({
             success:false,
             message:'Member not found'
         })
 
     }

     member=await Member.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindModify:false,
    });
    await member.recharge();
    member.save();

    const message=`Dear ${member.name} thank you renewing our Gym Membership ,
    Joining Date:${member.joining}
    Membership Start:${member.membershipStart}
    Membership End:${member.membershipEnd}`;
    
    try{
        await sendEmail({
            email:member.email,
            subject:` Gym Membersip Recharged`,
            message,
    
        });
    
        res.status(200).json({
            success:true,
            message:`Email sent to ${member.email} successfully `,
        });
    
    }
    catch(error){
    
    
      await member.save({validateBeforeSave:false});
      return next(new ErrorHandler(error.message,500));
    }

    res.status(200).json({
        success:true,
        member,
        message:'Membership Renewed'
    })
});


//Find Defaulters
exports.setDefaulters=catchAsyncErrors(async(req,res,next)=>{
    const member = await Member.findByIdAndUpdate(req.params.id);
    if(!member){
        return res.status(500).json({
             success:false,
             message:'Member not found'
         })
 
     }
        if(member.membershipEnd<Date.now()){
            member.status=false;

            const rechargeUrl=`${req.protocol}://${req.get(
                "host"
                )}/member/recharge/${member.id}`;
    
    
    
    
    
            const message=`Dear ${member.name} your Gym Subscription is expired ,kindly recharge by clicking on this link :-\n\n${rechargeUrl}`
    
            try{
                await sendEmail({
                    email:member.email,
                    subject:`Gym Membership Expired`,
                    message,
          
                });
          
                res.status(200).json({
                    success:true,
                    message:`Email sent to ${member.email} successfully `,
                });
          
            }
            catch(error){
          
           
              await member.save({validateBeforeSave:false});
              return next(new ErrorHandler(error.message,500));
            }



        }
     

    member.save();
   
    res.status(200).json({
        success:true,
        message:"Status Not Due"
       
        
    })

})
