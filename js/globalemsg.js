/*!
 * Copyright 2014 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

define(['jquery', 'oae.core'], function($, oae) {

    return function(uid, showSettings, widgetData) {

        // The widget container
        var $rootel = $('#' + uid);

       /**
         * Delete a task
         */
        var deleteGms = function() {
            // Get the `created` timestamp we stored in a data attribute on the
            // button. Hilary needs it to know which task to delete
            var gmsCreated = $(this).attr('data-created');

            $.ajax({
                'url': '/api/globalemsg/' + gmsCreated,
                'type': 'DELETE',
                'success': function(data) {
                    // Show a success notification when the task has been deleted
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_DELETED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_DELETE_SUCCESS__', 'globalemsg')
                    );
                    // Retrieve the new list of tasks
                    getGms();
                },
                'error': function() {
                    // Show a failure notification when the task couldn't be deleted
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_NOT_DELETED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_DELETE_FAILED__', 'globalemsg'),
                        'error'
                    );
                }
            });
        };



        /**
         * Create a new task
         */
        var createGms = function() {
            $.ajax({
                'url': '/api/globalemsg',
                'type': 'POST',
                'data': $('#globalemsg-gms-form', $rootel).serialize(),
                'success': function(data) {
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_CREATED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_CREATE_SUCCESS__', 'globalemsg')
                    );
                    getGms();
                    $('#globalemsg-gms-form', $rootel)[0].reset();
                },
                'error': function(donnee) {
                    console.log('Objest :',donnee);
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_NOT_CREATED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_CREATE_FAILED__', 'globalemsg'),
                        'error'
                    );
                    if (donnee.status ='402'){
                        oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_NOT_CREATED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_DATE_SUP__', 'globalemsg'),
                        'error'
                    );

                    }
                       if (donnee.status ='403'){
                        oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_NOT_CREATED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_DATE_EQUAL__', 'globalemsg'),
                        'error'
                    );
                    }
                         if (donnee.status ='401'){
                        oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_NOT_CREATED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_ADMIN_NOT_CREATED__', 'globalemsg'),
                        'error'
                    );
                    }

                }
            });

            return false;
        };

        /**
         * Render the list of tasks
         *
         * @param  {Task[]}    tasks    Array of task objects
         */
        var renderGmsList = function(gmss) {
            oae.api.util.template().render($('#globalemsg-gms-template', $rootel), {
                'gmss': gmss
            }, $('#globalemsg-gms-container', $rootel));
             console.log("List gmss",gmss);
        };

        /**
         * Retrieve the list of tasks
         */
        var getGms = function() {
            $.ajax({
                'url': '/api/globalemsg',
                'type': 'GET',
                'success': function(data) {
                    // Render the list of tasks in the UI
                    renderGmsList(data.gmss);
                },
                'error': function() {
                    oae.api.util.notification(
                        oae.api.i18n.translate('__MSG__GMS_NOT_RETRIEVED__', 'globalemsg'),
                        oae.api.i18n.translate('__MSG__GMS_RETRIEVE_FAILED__', 'globalemsg'),
                        'error'
                    );
                }
            });
            console.log("Commande GET UI");
        };

        /**
         * Bind to various elements in the widget
         */
        var addBinding = function() {
            $rootel.on('submit', '#globalemsg-gms-form', createGms);
            $rootel.on('click', '.globalemsg-gms-delete', deleteGms);
        };

        /**
         * Render the tasklist header
         */
        var renderGmsListHeader = function() {
             
            oae.api.util.template().render($('#globalemsg-header-template', $rootel), null, $('#globalemsg-header-container', $rootel));
        };
       

      var setUpValidation = function() {
            var validateOpts = {

                'messages': {
                    'title': {
                        'required': oae.api.i18n.translate('__MSG__PLEASE_ENTER_YOUR_TITLE__', 'globalemsg')
                    },
                    'description': {
                        'required': oae.api.i18n.translate('__MSG__PLEASE_ENTER_YOUR_DESCRIPTION__', 'globalemsg')
                    },
                    'date_start': {
                        'required': oae.api.i18n.translate('__MSG__PLEASE_ENTER_YOUR_DATE_START__', 'globalemsg'),
                        'date': oae.api.i18n.translate('__MSG__PLEASE_ENTER_YOUR_FORMAT_DATE__', 'globalemsg')
                    },
                    'date_end': {
                        'required': oae.api.i18n.translate('__MSG__PLEASE_ENTER_DATE_END__', 'globalemsg'),
                        'date': oae.api.i18n.translate('__MSG__PLEASE_ENTER_YOUR_FORMAT_DATE__', 'globalemsg')
                    }
                    },
                'submitHandler': createGms
            };
            oae.api.util.validation().validate($('#globalemsg-gms-form', $rootel), validateOpts);
        };

        /**
         * Initialize the task list widget
         */
        var initGmsList = function() {
            // Render the task list header
            // 
            renderGmsListHeader();
             //$(function() {$( "#datepicker" ).datepicker();});

            // Get the tasks
            getGms();
        };
      
        addBinding();
        initGmsList();
        setUpValidation();
        

    };
});

