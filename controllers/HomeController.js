class HomeController{

    async index(req, res){
        res.send("By Éverton Carvalho");
    }

    async validate(req, res){
        res.send("okay");
    }
}

module.exports = new HomeController();