__version__ = "0.7.5"

class ServiceApp(App):
    def build(self):
        from jnius import autoclass

        Intent = autoclass('android.content.Intent')
        LbrynetService = autoclass('io.lbry.browser.LbrynetService')
        
if __name__ == '__main__':
    ServiceApp().run()

