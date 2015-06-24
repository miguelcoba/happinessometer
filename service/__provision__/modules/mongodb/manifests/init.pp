class mongodb {
	require system

	package { 'mongodb':
		ensure => installed
	}

	service { 'mongodb':
		enable => true,
		ensure => running,
		require => Package['mongodb']
	}
}