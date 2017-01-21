#
# Actions:
#
#    db.local-remote    Sync a local and remote database
#

########################################################
###                     Variables                    ###
########################################################

ifndef SERVER_HOST
    $(error Variable SERVER_HOST isn't defined)
endif

# Project name
PROJECT_NAME ?= $(shell jq -r '.name' package.json)

# Mongo host
LOCAL_MONGO_HOST ?= 127.0.0.1

# Database name
LOCAL_DB_NAME ?= $(PROJECT_NAME)

# Local dump archive
LOCAL_DUMP_ARCHIVE ?= dump.gz

# Remote mongo host
REMOTE_MONGO_HOST ?= 127.0.0.1

# Remote database name
REMOTE_DB_NAME ?= $(PROJECT_NAME)

# Remote www root
REMOTE_WWW_ROOT ?= /var/www

# Remote temporary directory
REMOTE_TMP_DIR ?= $(REMOTE_WWW_ROOT)/tmp

# Unix timestamp
UNIX_TIMESTAMP := $(shell date +%s)

# Remote dump name
REMOTE_DUMP_NAME ?= $(PROJECT_NAME)-dump-$(UNIX_TIMESTAMP)

# Remote temporary dump archive
REMOTE_TMP_DUMP_ARCHIVE ?= $(REMOTE_TMP_DIR)/$(REMOTE_DUMP_NAME).gz

# Remote backups directory
REMOTE_BACKUP_DUMPS_DIR ?= $(REMOTE_WWW_ROOT)/dumps

# Remote backup dump archive
REMOTE_BACKUP_DUMP_ARCHIVE ?= $(REMOTE_BACKUP_DUMPS_DIR)/$(PROJECT_NAME)-dump-$(UNIX_TIMESTAMP).gz

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
###                    Dump rules                    ###
########################################################

# Sync a local and remote database
.PHONY: db.local-remote
db.local-remote: db.local.dump \
                 db.remote.dump \
                 db.local.copy-dump-to-remote-tmp-dir \
                 db.local.dump-remove \
                 db.remote.restore-from-tmp-dump \
                 db.remote.remove-tmp-dump

# Dump a local database
.PHONY: db.local.dump
db.local.dump:
	$(call printActionTitle,Dumping a local database)

	mongodump \
	    --host=$(LOCAL_MONGO_HOST) \
	    --db=$(LOCAL_DB_NAME) \
	    --archive=$(LOCAL_DUMP_ARCHIVE) \
	    --gzip \
	    --verbose=1

# Remove a local dump archive
.PHONY: db.local.dump-remove
db.local.dump-remove:
	$(call printActionTitle,Removing a local dump)

	rm -rf $(LOCAL_DUMP_ARCHIVE)

# Copy a dump archive to a remote temporary directory
.PHONY: db.local.copy-dump-to-remote-tmp-dir
db.local.copy-dump-to-remote-tmp-dir:
	$(call printActionTitle,Copying a dump to a remote temporary directory)

	scp $(LOCAL_DUMP_ARCHIVE) fast-vps:$(REMOTE_TMP_DUMP_ARCHIVE)

# Restore from a temporary dump archive
.PHONY: db.remote.restore-from-tmp-dump
db.remote.restore-from-tmp-dump:
	$(call printActionTitle,Restoring from a temporary dump)

	ssh $(SERVER_HOST) ' \
        mongorestore \
            --host=$(REMOTE_MONGO_HOST) \
            --archive=$(REMOTE_TMP_DUMP_ARCHIVE) \
            --gzip \
            --drop \
        '
# Dump a remote database
.PHONY: db.remote.dump
db.remote.dump:
	$(call printActionTitle,Dumping a remote database)

	ssh $(SERVER_HOST) ' \
        mongodump \
            --host=$(REMOTE_MONGO_HOST) \
            --db=$(REMOTE_DB_NAME) \
            --archive=$(REMOTE_BACKUP_DUMP_ARCHIVE) \
            --gzip \
        '

# Remove a temporary dump archive
.PHONY: db.remote.remove-tmp-dump
db.remote.remove-tmp-dump:
	$(call printActionTitle,Removing a temporary dump)

	ssh $(SERVER_HOST) 'rm $(REMOTE_TMP_DUMP_ARCHIVE)'
