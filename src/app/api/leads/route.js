import { ConnectDB } from "@/lib/db/ConnectDB"
import LeadsModel from "@/lib/models/LeadsModel"
import { NextResponse } from "next/server";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB()

export async function POST(request) {
    const { username, mobile, email, message,address } = await request.json()
    // console.log(username)
    // Basic validation
   

    try {
        // await transporter.sendMail(mailOptions);
        if (!username || !mobile || !email) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        await LeadsModel.create({
            username,
            mobile,
            email,
            message,
            address,
        })
        return NextResponse.json({ msg: "Created" }, {
            status: 201
        })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ msg: "Error sending message." }, {
            status: 500
        })
    }
}


export async function GET(request) {
    const leads = await LeadsModel.find({});
    return NextResponse.json({ leads }, { status: 200 })
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id")
    await TodoModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Lead deleted" }, {
        status: 200
    })
}


export async function PUT(request) {

    const id = request.nextUrl.searchParams.get("id")

    await LeadsModel.findByIdAndUpdate(id, {
        $set: {
            isComplete: true
        }
    });

    return NextResponse.json({ msg: "Lead Updated" }, {
        status: 200
    })
}

// const postHandle = async (req, res) => {
//     const { username, mobile, email, message } = req.body;
//     // // Basic validation
//     // if (!username || !mobile || !email) {
//     //     return res.status(400).json({ message: 'All fields are required.' });
//     // }

//     // // Setup nodemailer
//     // const transporter = nodemailer.createTransport({
//     //     service: 'Gmail', // Use your email service
//     //     auth: {
//     //         user: process.env.EMAIL_USER, // Your email
//     //         pass: process.env.EMAIL_PASS, // Your email password or app password
//     //     },
//     // });

//     // const mailOptions = {
//     //     from: email,
//     //     to: process.env.EMAIL_USER, // Where to send the email
//     //     subject: `Contact Us Form Submission from ${username}`,
//     //     text: `Name: ${username}\nMobile: ${mobile}\nEmail: ${email}\nMessage: ${message}`,
//     // };

//     // try {
//     //     await transporter.sendMail(mailOptions);
//     //     return res.status(200).json({ message: 'Message sent successfully!' });
//     // } catch (error) {
//     //     console.error(error);
//     //     return res.status(500).json({ message: 'Error sending message.' });
//     // }
// }

// export default hanlder