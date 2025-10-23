import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth','routes/auth.tsx'),
    route('/upload','routes/_upload.tsx'),
    route('/resume/:id', 'routes/_resume.tsx'),
] satisfies RouteConfig;
