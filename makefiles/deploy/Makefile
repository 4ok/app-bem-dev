#
# Actions:
#
#    deploy     Deploy build
#

########################################################
###                     Variables                    ###
########################################################

# The project name
PROJECT_NAME ?= $(shell basename $(PWD))

# Build directory
BUILD_DIR ?= build

# Build file
BUILD_FILE ?= build.tar.gz

# Remote www root
REMOTE_WWW_ROOT ?= /var/www

# Remote builds dir
REMOTE_BUILDS_DIR ?= $(REMOTE_WWW_ROOT)/builds

# Remote projects dir
REMOTE_PROJECTS_DIR ?= $(REMOTE_WWW_ROOT)/projects

# Remote backups dir
REMOTE_BACKUPS_DIR ?= $(REMOTE_WWW_ROOT)/backups

# Remote build name
REMOTE_BUILD_NAME ?= $(PROJECT_NAME)-$(shell date +%s)

# Remote build file name
REMOTE_BUILD_FILE ?= $(REMOTE_BUILD_NAME).tar.gz

# Remote build file
REMOTE_BUILD_FILE ?= $(REMOTE_BUILDS_DIR)/$(REMOTE_BUILD_FILE)

# Remote build dir
REMOTE_BUILD_DIR ?= $(REMOTE_BUILDS_DIR)/$(REMOTE_BUILD_NAME)

# Remote project dir
REMOTE_BUILD_PROJECT_DIR ?= $(REMOTE_PROJECTS_DIR)/$(PROJECT_NAME)

# Remote backup file
REMOTE_BUILD_BACKUP_FILE ?= $(REMOTE_BACKUPS_DIR)/$(REMOTE_BUILD_FILE)

########################################################
###                     Functions                    ###
########################################################

#
# Print the title of action
#
# $(1) {String} Title
#
ifndef printActionTitle
define printActionTitle
    $(info )
    $(info =====> $(1))
endef
endif

########################################################
###                   Deploy rules                   ###
########################################################

.PHONY: deploy
deploy: deploy.copy

.PHONY: deploy.copy
deploy.copy:
	$(call printActionTitle,Deploying build files)

	tar -zcf $(BUILD_FILE) $(BUILD_DIR)
	scp $(BUILD_FILE) fast-vps:$(REMOTE_BUILD_FILE)

	ssh fast-vps ' \
	    rm -rf $(REMOTE_BUILD_DIR) \
	    && mkdir $(REMOTE_BUILD_DIR) \
        && tar -C $(REMOTE_BUILD_DIR) --strip-components 1 \
            -zxf $(REMOTE_BUILD_FILE) 2>/dev/null \
        && cd $(REMOTE_BUILD_DIR) \
        && npm install \
        && bower install --allow-root \
        && if [ -d $(REMOTE_BUILD_PROJECT_DIR) ]; then \
            tar -zcf $(REMOTE_BUILD_BACKUP_FILE) $(REMOTE_BUILD_PROJECT_DIR) \
            && rm -rf $(REMOTE_BUILD_PROJECT_DIR); \
        fi \
        && mv $(REMOTE_BUILD_DIR) $(REMOTE_BUILD_PROJECT_DIR) \
        && rm -rf $(REMOTE_BUILD_DIR) \
        && rm -rf $(REMOTE_BUILD_FILE) \
        && make startOrRestart \
	    '
