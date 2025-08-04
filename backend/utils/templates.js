module.exports.sendOtpEmailTemplate = ({ name, emailSubject, otp }) => {
    const otpString = otp.toString();
    const formattedOtp = otpString.split("");

    return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${emailSubject}</title>
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            rel="stylesheet"
        />
        <style>
            body {
                font-family: "Inter", sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body
        style="
            background-color: #f8fafc;
            font-family: 'Inter', sans-serif;
            color: #333;
        "
    >
        <div style="margin: 0 auto; padding: 0 10px">
            <div
                style="
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 10px;
                    font-family: Arial, sans-serif;
                "
            >
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        align-items: start;
                        justify-content: center;
                        text-align: center;
                    "
                >
                    <p
                        style="
                            font-size: 30px;
                            font-weight: 700;
                            color: #2969ff; 
                        "
                    >
                        Welcome to Trade+
                    </p>
                </div>
                <hr />
                <h2
                    style="
                        font-size: 24px;
                        font-weight: 700;
                        color: black;
                        margin-top: 24px;
                    "
                >
                    Confirm Verification Code
                </h2>

                ${
                    name &&
                    `<p style="font-size: 16px; line-height: 1.5; color: #384860">
                            Hi ${name},
                        </p>`
                }

                <p style="font-size: 16px; line-height: 1.5; color: #384860">
                    Please use the following verification code to proceed. This
                    code is valid for 5 minutes.
                </p>

                                <div style="display: flex; gap: 20px; margin: 16px 0; justify-content: center;">
                   ${formattedOtp
                       .map(
                           (digit, index) => `
                        <div
                            style="
                                width: 64px;
                                height: 64px;
                                border: 1px solid #2969ff;
                                border-radius: 8px;
                                text-align: center;
                                line-height: 64px;
                                font-size: 24px;
                                font-weight: 700;
                                color: #030b1d;
                                margin: 0 10px;
                            "
                        >
                            ${digit}
                        </div>
                   `
                       )
                       .join("")}
                </div>

                <div
                    style="
                        text-align: center;
                        margin: 10px auto;
                        padding: 20px;
                        color: #777;
                    "
                >
                    <hr
                        style="
                            border: none;
                            border-top: 1px solid #ddd;
                            margin-top: 10px;
                            margin-bottom: 10px;
                        "
                    />
                </div>

                <footer
                    style="
                        margin-top: 10px;
                        font-size: 1rem;
                        color: #999;
                        text-align: center;
                    "
                >
                    <div
                        style="font-size: 14px; text-align: start; color: #333"
                    >
                        <!--<strong>Contact Us</strong>-->
                        <p></p>
                        <strong>Location</strong> 
                        <p>
                            - Jackpot Travels 1/22, 2nd Floor, Asaf Ali Road New
                            Baner - 411045
                        </p>
                        <p>
                            Questions? Contact us at
                            <a
                                href="mailto:info@trade.in.com"
                                style="color: #2969ff; text-decoration: none"
                                >info@trade.uk.com</a
                            >
                        </p>
                    </div>
                    <div
                        style="text-align: start; font-size: 14px; color: #666"
                    >
                        © 2025 — Copyright All Rights Reserved
                    </div>
                </footer>
            </div>
        </div>
    </body>
</html>
`;
};
