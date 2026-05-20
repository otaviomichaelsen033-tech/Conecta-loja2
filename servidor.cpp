 
int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")
    ([](){
        return "Servidor C++ funcionando!";
    });

    app.port(18080).multithreaded().run();
}