#
# Actions:
#
#    deploy     Deploy build
#

########################################################
###                     Variables                    ###
########################################################

MAKEFLAGS += --no-print-directory

ifndef SERVER_IP
    $(error Variable SERVER_IP isn't defined)
endif

# Project name
PROJECT_NAME ?= $(shell basename $(CURDIR))

# Local build directory
LOCAL_BUILD_DIR ?= build

# Loal build archive
LOCAL_BUILD_ARCHIVE ?= build.tar.gz

# Remote www root
REMOTE_WWW_ROOT ?= /var/www

# Remote temporary directory
REMOTE_TMP_DIR ?= $(REMOTE_WWW_ROOT)/tmp

# Remote projects directory
REMOTE_PROJECTS_DIR ?= $(REMOTE_WWW_ROOT)/projects

# Remote backups directory
REMOTE_BACKUPS_DIR ?= $(REMOTE_WWW_ROOT)/backups

# Unix timestamp
UNIX_TIMESTAMP := $(shell date +%s)

# Remote build name
REMOTE_BUILD_NAME ?= $(PROJECT_NAME)-release-$(UNIX_TIMESTAMP)

# Remote build archive
REMOTE_TMP_BUILD_ARCHIVE ?= $(REMOTE_TMP_DIR)/$(REMOTE_BUILD_NAME).tar.gz

# Remote build directory
REMOTE_TMP_BUILD_DIR ?= $(REMOTE_TMP_DIR)/$(REMOTE_BUILD_NAME)

# Remote project directory
REMOTE_PROJECT_BUILD_DIR ?= $(REMOTE_PROJECTS_DIR)/$(PROJECT_NAME)

# Remote backup archive
REMOTE_BACKUP_BUILD_ARCHIVE ?= $(REMOTE_BACKUPS_DIR)/$(REMOTE_BUILD_NAME).gz

########################################################
###                     Functions                    ###
########################################################

#
# Print a title of action
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

# Deploy a project
.PHONY: deploy
deploy: build.local.copy-to-remote-tmp-dir \
        build.remote.unzip \
        build.remote.install \
        project.remote.backup \
        project.remote.remove \
        build.remote.move-to-projects-dir \
        project.remote.start

# Remove a local build archive
.PHONY: build.local.remove
build.local.remove:
	$(call printActionTitle,Removing a local build archive)

	rm $(LOCAL_BUILD_ARCHIVE)

# Copy a build archive to a remote temporary directory
.PHONY: build.local.copy-to-remote-tmp-dir
build.local.copy-to-remote-tmp-dir:
	$(call printActionTitle,Copying a build archive to a remote temporary directory)

	scp $(LOCAL_BUILD_ARCHIVE) fast-vps:$(REMOTE_TMP_BUILD_ARCHIVE)

# Unzip and move build to a temporary directory
.PHONY: build.remote.unzip
build.remote.unzip:
	$(call printActionTitle,Unziping and move build to a temporary directory)

	ssh $(SERVER_IP) ' \
	    rm -rf $(REMOTE_TMP_BUILD_DIR) \
	    && mkdir $(REMOTE_TMP_BUILD_DIR) \
        && tar \
            -C $(REMOTE_TMP_BUILD_DIR) --strip-components 1 \
            -zxf $(REMOTE_TMP_BUILD_ARCHIVE) 2>/dev/null \
	    '

# Install modules
.PHONY: build.remote.install
build.remote.install:
	$(call printActionTitle,Installing modules)

	ssh $(SERVER_IP) 'make --no-print-directory -C $(REMOTE_TMP_BUILD_DIR) install'

# Backup project
.PHONY: project.remote.backup
project.remote.backup:
	$(call printActionTitle,Backuping project)

	ssh $(SERVER_IP) ' \
        if [ -d $(REMOTE_PROJECT_BUILD_DIR) ]; then \
            tar -zcf $(REMOTE_BACKUP_BUILD_ARCHIVE) $(REMOTE_PROJECT_BUILD_DIR); \
        fi \
	    '

# Remove project
.PHONY: project.remote.remove
project.remote.remove:
	$(call printActionTitle,Removing project)

	ssh $(SERVER_IP) ' \
        if [ -d $(REMOTE_PROJECT_BUILD_DIR) ]; then \
            rm -rf $(REMOTE_PROJECT_BUILD_DIR); \
        fi \
	    '

# Move build to project directory
.PHONY: build.remote.move-to-projects-dir
build.remote.move-to-projects-dir:
	$(call printActionTitle,Moving build to project directory)

	ssh $(SERVER_IP) ' \
	    mv $(REMOTE_TMP_BUILD_DIR) $(REMOTE_PROJECT_BUILD_DIR) \
        && rm -rf $(REMOTE_TMP_BUILD_DIR) \
        && rm -rf $(REMOTE_TMP_BUILD_ARCHIVE) \
	    '

# Start or restart project
.PHONY: project.remote.start
project.remote.start:
	$(call printActionTitle,Start or restart project)

	ssh $(SERVER_IP) 'make --no-print-directory -C $(REMOTE_PROJECT_BUILD_DIR) startOrRestart'
