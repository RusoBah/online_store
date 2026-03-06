import UserService from "../services/UserService.js";

class UserController {
    async signup(req, res, next) {
        try {
            const { email, password, role } = req.body;
            const token = await UserService.signup(email, password, role);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }

    async check(req, res, next) {
        try {
            const token = await UserService.check(req.auth.id, req.auth.email, req.auth.role);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }

}

export default new UserController();
