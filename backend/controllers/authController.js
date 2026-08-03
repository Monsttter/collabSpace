import * as authService from "../services/authService.js";

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export async function register(req, res, next){

    try {
        
        const { username, email, password } = req.body;
        
        const result = await authService.register(
            
            username,

            email,
            
            password
            
        );
        
        return res.status(201).json({
            
            success: true,
            
            data: result
            
        });
        
    }
    
    catch (error) {
    
        next(error);
    
    }
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(req, res, next){

    try {

    const { email, password } = req.body;

    const result = await authService.login(

        email,

        password

    );

    return res.json({

        success: true,

        data: result

    });

    }
    
    catch (error) {
    
        next(error);
    
    }

};

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

export async function getCurrentUser(req, res, next){

    try {

    const user = await authService.getCurrentUser(

        req.user.id

    );

    return res.json({

        success: true,

        data: user

    });

    }
    
    catch (error) {
    
        next(error);
    
    }

};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(req, res, next){

    try {

    const { username, avatarUrl } = req.body;

    const user = await authService.updateProfile(

        req.user.id,

        username,

        avatarUrl

    );

    return res.json({

        success: true,

        data: user

    });

    }
    
    catch (error) {
    
        next(error);
    
    }

};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export async function changePassword(req, res, next){

    try {

    const {

        currentPassword,

        newPassword

    } = req.body;

    await authService.changePassword(

        req.user.id,

        currentPassword,

        newPassword

    );

    return res.json({

        success: true,

        message: "Password updated successfully."

    });

    }
    
    catch (error) {
    
        next(error);
    
    }

};