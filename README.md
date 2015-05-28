# globalemsg-admin
OAE globalemsg admin ui
The Hilary counterpart can be found in the [oaeproject repository](https://github.com/dooremont/globalemsg-hilary "OAE Project repository")

Make sure to also read the [widget development wiki (WIP)](https://github.com/oaeproject/3akai-ux/wiki/Widget-Development-[WIP] "Widget development wiki (WIP)")

## INSTALL
in Directory 3akai-ux/node_modules/oae-admin/
git clone https://github.com/dooremont/globalemsg-admin.git
edit file : 3akai-ux/admin/admin.js
modify line 160 }); by },
and add `
    {
    'id': 'globalemsg-admin',
    'icon': 'fa-exclamation-triangle',
    'closeNav': true,
    'title': oae.api.i18n.translate('Gestion des messages'),
    'layout': [
      {
        'width': 'col-md-12',
        'widgets': [
           {
            'name': 'globalemsg-admin',
            'settings': {
            'context': currentContext
             }
           }
         ]
       }
    ]
    });`
