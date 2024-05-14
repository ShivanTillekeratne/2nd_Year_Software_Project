class MongoRouter:
    # A router to direct database operations for models in the formongo app to MongoDB.
    def db_for_read(self, model, **hints):
        # Send all read operations on formongo app models to 'mongodb'.
        if model._meta.app_label == 'formongo':
            return 'mongodb'
        return None

    def db_for_write(self, model, **hints):
        # Send all write operations on formongo app models to 'mongodb'.
        if model._meta.app_label == 'formongo':
            return 'mongodb'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations if a model in the formongo app is involved.
        if obj1._meta.app_label == 'formongo' or obj2._meta.app_label == 'formongo':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Make sure the formongo app only appears in the 'mongodb' database.
        if app_label == 'formongo':
            return db == 'mongodb'
        elif db == 'mongodb':
            return False
        return None
